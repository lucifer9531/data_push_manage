<template>
  <div
    style="
      display: flex;
      position: relative;
      flex-direction: column;
      min-height: calc(100vh - 80px);
    "
  >
    <e-header slot="right" style="position: absolute; right: 95px" />
    <crudOperation />
    <a-table
      ref="table"
      :columns="columns"
      :data-source="crud.data"
      :loading="crud.loading"
      :pagination="false"
      :row-key="(row) => row.alertId"
      size="small"
      style="width: 100%"
    >
      <template slot="enableFlag" slot-scope="scope">
        <a-switch
          :checked="scope.enableFlag === '1'"
          checked-children="启用"
          un-checked-children="禁用"
          @change="changeEnable($event, scope)"
        />
      </template>
      <template slot="operation" slot-scope="scope">
        <udOperation :data="scope" />
      </template>
    </a-table>
    <pagination class="pagination" />
    <e-form />
  </div>
</template>

<script>
  import CRUD, { presenter, crud } from '@crud/crud';
  import crudMonitorConfig, { updatePushAlertEnable } from '@/api/monitor';
  import crudOperation from '@crud/CRUD.operation';
  import udOperation from '@crud/UD.operation';
  import pagination from '@crud/Pagination';
  import eHeader from './header';
  import eForm from './form';
  import moment from 'moment/moment';
  import { alertTypeEnum, levelEnum } from '../data';

  export default {
    name: 'TargetConfig',
    components: {
      eHeader,
      eForm,
      pagination,
      crudOperation,
      udOperation,
    },
    cruds() {
      return CRUD({
        url: '/push_engine/pushAlert/selectPushAlert',
        crudMethod: { ...crudMonitorConfig },
        idField: 'alertId',
      });
    },
    mixins: [presenter(), crud()],
    data() {
      return {
        columns: Object.freeze([
          { title: '告警标题', dataIndex: 'name', ellipsis: true },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            ellipsis: true,
            width: 180,
            customRender: (value) => {
              return moment(value).format('YYYY-MM-DD HH:mm:ss') || '--';
            },
          },
          {
            title: '告警级别',
            dataIndex: 'level',
            ellipsis: true,
            customRender: (value) => {
              return levelEnum.find((item) => item.id === value)?.name || '--';
            },
          },
          {
            title: '告警方式',
            dataIndex: 'alertType',
            ellipsis: true,
            customRender: (value) => {
              const methods = value.split(',');
              const temp = alertTypeEnum.filter((item) => methods.includes(item.id));
              return temp.map((item) => item.name).join(',');
            },
          },
          { title: '通知人员', dataIndex: 'noticeName', ellipsis: true },
          {
            title: '启用标记',
            ellipsis: true,
            scopedSlots: { customRender: 'enableFlag' },
          },
          { title: '通知间隔(分钟)', dataIndex: 'noticeInterval', ellipsis: true },
          { title: '企业', dataIndex: 'entId', ellipsis: true },
          {
            title: '操作',
            width: 90,
            scopedSlots: { customRender: 'operation' },
            fixed: 'right',
          },
        ]),
      };
    },
    created() {
      this.crud.optShow = {
        add: true,
        reset: false,
        edit: false,
        del: false,
        download: false,
      };
    },
    methods: {
      async updatePushAlertEnable(val, data) {
        const { alertId } = data;
        try {
          await updatePushAlertEnable({
            alertId,
            enableFlag: val ? '1' : '0',
          });
          this.$message.success('修改成功');
          this.crud.toQuery();
        } catch (err) {
          throw new Error(err);
        }
      },
      changeEnable(val, row) {
        this.updatePushAlertEnable(val, row);
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
