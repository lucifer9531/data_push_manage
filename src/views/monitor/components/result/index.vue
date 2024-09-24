<template>
  <div
    style="
      display: flex;
      position: relative;
      flex-direction: column;
      min-height: calc(100vh - 80px);
    "
  >
    <e-header slot="right" style="position: absolute; right: 0" />
    <crudOperation />
    <a-table
      ref="table"
      :columns="columns"
      :data-source="crud.data"
      :loading="crud.loading"
      :pagination="false"
      :row-key="(row) => row.recId"
      :scroll="{ x: 1200, y: tableHeight }"
      size="small"
      style="width: 100%; margin-top: 32px"
    >
      <template slot="operation" slot-scope="scope">
        <a class="grey" @click.stop="toInfo(scope)">
          <a-icon type="info-circle" />
        </a>
      </template>
    </a-table>
    <pagination class="pagination" />
    <e-details ref="details" />
  </div>
</template>

<script>
  import CRUD, { presenter, crud } from '@crud/crud';
  import crudOperation from '@crud/CRUD.operation.vue';
  import pagination from '@crud/Pagination';
  import eHeader from './header';
  import eDetails from './eDetails.vue';
  import moment from 'moment/moment';
  import { alertTypeEnum, levelEnum, noticeResultEnum } from '../data';

  export default {
    name: 'TargetConfig',
    components: {
      crudOperation,
      eHeader,
      pagination,
      eDetails,
    },
    cruds() {
      return CRUD({
        url: '/push_engine/pushAlert/selectPushAlertRec',
        idField: 'recId',
      });
    },
    mixins: [presenter(), crud()],
    data() {
      return {
        columns: Object.freeze([
          { title: '告警标题', dataIndex: 'alertName', ellipsis: true },
          {
            title: '告警时间',
            dataIndex: 'alertTime',
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
            dataIndex: 'sendType',
            ellipsis: true,
            customRender: (value) => {
              const methods = value.split(',');
              const temp = alertTypeEnum.filter((item) => methods.includes(item.id));
              return temp.map((item) => item.name).join(',');
            },
          },
          { title: '通知人员', dataIndex: 'userName', ellipsis: true },
          {
            title: '通知时间',
            ellipsis: true,
            dataIndex: 'sendTime',
            width: 180,
            customRender: (value) => {
              return moment(value).format('YYYY-MM-DD HH:mm:ss') || '--';
            },
          },
          {
            title: '通知结果',
            dataIndex: 'sendResult',
            ellipsis: true,
            customRender: (value) => {
              return noticeResultEnum.find((item) => item.id === value)?.name || '--';
            },
          },
          { title: '企业', dataIndex: 'entId', ellipsis: true },
          {
            title: '操作',
            width: 90,
            scopedSlots: { customRender: 'operation' },
            fixed: 'right',
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
    mounted() {
      this.updateTableHeight();
      window.addEventListener('resize', this.updateTableHeight);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.updateTableHeight);
    },
    methods: {
      updateTableHeight() {
        const windowHeight = window.innerHeight;
        const offsetHeight = 230;
        this.tableHeight = windowHeight - offsetHeight;
      },
      toInfo(data) {
        this.$refs.details.visible = true;
        this.$refs.details.getPushAlertRecById(data.recId);
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
