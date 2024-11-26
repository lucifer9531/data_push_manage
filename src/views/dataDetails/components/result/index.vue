<template>
  <div
    style="
      display: flex;
      position: relative;
      flex-direction: column;
      min-height: calc(100vh - 80px);
    "
  >
    <e-header slot="right" style="position: absolute; right: 2px" />
    <crudOperation>
      <a-button
        slot="del-btn-right"
        :disabled="selections.length === 0"
        class="mr10"
        type="primary"
        @click="batchPush"
      >
        批量推送
      </a-button>
      <a-button slot="del-btn-right" type="primary" @click="exportExcel"> 导出 </a-button>
    </crudOperation>
    <a-table
      ref="table"
      :columns="columns"
      :data-source="crud.data"
      :loading="crud.loading"
      :pagination="false"
      :row-key="(row) => row.id"
      :row-selection="{ selectedRowKeys, columnWidth: 40, onChange: selectionChangeHandler }"
      :scroll="{ x: 1200 }"
      size="small"
      style="width: 100%; height: calc(100vh - 170px); margin-top: 10px; overflow-y: auto"
    >
      <template slot="operation" slot-scope="scope">
        <a class="grey mr10" @click.stop="toInfo(scope)">
          <a-icon type="info-circle" />
        </a>
        <a v-if="[0, 2].includes(scope.pushStatus)" class="grey" @click="rePushRecord(scope)">
          <a-icon type="reload" />
        </a>
      </template>
    </a-table>
    <pagination class="pagination" />
    <e-details ref="details" />
  </div>
</template>

<script>
  import CRUD, { presenter, crud } from '@crud/crud';
  import crudOperation from '@crud/CRUD.operation';
  import pagination from '@crud/Pagination';
  import moment from 'moment';
  import { pushStatusEnum, pushTypeEnum } from './data';
  import eHeader from './header.vue';
  import eDetails from './eDetails';
  import { exportResultShowExcel, rePushRecord } from '@/api/dataDetails';
  import { downloadFile } from '@/utils';

  export default {
    name: 'TargetConfig',
    components: {
      pagination,
      crudOperation,
      eHeader,
      eDetails,
    },
    cruds() {
      return CRUD({
        url: '/push_engine/pushRecord/resultShow',
      });
    },
    mixins: [presenter(), crud()],
    data() {
      return {
        selections: [],
        selectedRowKeys: [],
        columns: Object.freeze([
          { title: '会话ID', width: 210, dataIndex: 'sessionId', ellipsis: true },
          { title: '接口编码', width: 220, dataIndex: 'interfaceCode', ellipsis: true },
          {
            title: '接口名称',
            width: 220,
            dataIndex: 'interfaceName',
            ellipsis: true,
          },
          { title: '目标名称', width: 300, dataIndex: 'targetName', ellipsis: true },
          {
            title: '推送状态',
            width: 90,
            dataIndex: 'pushStatus',
            ellipsis: true,
            customRender: (value) => {
              return pushStatusEnum.find((item) => item.id === value)?.name || '--';
            },
          },
          {
            title: '类型',
            width: 90,
            dataIndex: 'pushType',
            ellipsis: true,
            customRender: (value) => {
              return pushTypeEnum.find((item) => item.id === value)?.name || '--';
            },
          },
          {
            title: '推送时间',
            dataIndex: 'pushTime',
            ellipsis: true,
            width: 180,
            customRender: (value) => {
              return moment(value).format('YYYY-MM-DD HH:mm:ss') || '--';
            },
          },
          {
            title: '接收时间',
            dataIndex: 'sourceReceiveTime',
            ellipsis: true,
            width: 180,
            customRender: (value) => {
              return moment(value).format('YYYY-MM-DD HH:mm:ss') || '--';
            },
          },
          { title: '说明', dataIndex: 'remark', width: 100, ellipsis: true },
          {
            title: '操作',
            width: 60,
            fixed: 'right',
            scopedSlots: { customRender: 'operation' },
          },
        ]),
        tableHeight: 0,
      };
    },
    created() {
      this.crud.optShow = {
        add: false,
        reset: false,
        edit: false,
        del: false,
        download: false,
      };
    },
    methods: {
      selectionChangeHandler(selectedRowKeys, rows) {
        this.selections = rows;
        this.selectedRowKeys = selectedRowKeys;
      },
      async rePushRecord(data) {
        try {
          let pushRecordIds = '';
          let sourceReceiveTime = '';
          if (Array.isArray(data)) {
            pushRecordIds = data.map((item) => item.id).join(',') || '';
            sourceReceiveTime = data[0]?.sourceReceiveTime || '';
          } else {
            const { id, sourceReceiveTime: time } = data;
            pushRecordIds = id;
            sourceReceiveTime = time;
          }
          await rePushRecord({
            pushRecordIds,
            sourceReceiveTime,
          });
          this.$message.success('推送成功');
          this.crud.toQuery();
          this.selections = [];
          this.selectedRowKeys = [];
        } catch (err) {
          throw new Error(err);
        }
      },
      toInfo(data) {
        this.$refs.details.visible = true;
        this.$refs.details.getResultShowDetail(data);
      },
      batchPush() {
        this.$confirm({
          title: '提示',
          content: '延迟推送或推送中的不会重推，确定要推送选中的数据吗?',
          cancelText: '取消',
          okText: '确定',
          centered: true,
          onOk: () => {
            const temp = this.selections.filter((item) => ![1, 3].includes(item.pushStatus));
            this.rePushRecord(temp);
          },
          cancel: () => {},
        });
      },
      async exportExcel() {
        const item = {
          pushStatus: this.crud.query.pushStatus || '',
          sessionId: this.crud.query.sessionId || null,
          interfaceId: this.crud.query.interfaceId || null,
          targetId: this.crud.query.targetId || null,
          startTime: this.crud.query.startTime || null,
          endTime: this.crud.query.endTime || null,
          pushRecordIds: this.selectedRowKeys.join(',') || '',
        };
        const formData = new FormData();
        formData.append('item', JSON.stringify(item));
        const data = await exportResultShowExcel(formData);
        downloadFile(data, '推送结果', 'xls');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .pagination {
    position: absolute;
    right: 0;
    bottom: 0;
  }
</style>
