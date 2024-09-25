<template>
  <div class="app-container" style="position: relative">
    <e-header slot="right" style="position: absolute; right: 105px" />
    <crudOperation>
      <a-button slot="del-btn-right" style="margin-left: 10px" type="primary" @click="downloadTpl">
        <a-icon class="mr5" type="cloud-download" />
        脚本模板
      </a-button>
    </crudOperation>
    <div style="position: absolute; top: 20px; left: 225px">
      <a-icon class="info-icon" type="info-circle" />
      <span class="text">添加策略前请先下载脚本模版</span>
    </div>
    <a-table
      ref="table"
      :columns="columns"
      :data-source="crud.data"
      :loading="crud.loading"
      :pagination="false"
      :row-key="(row) => row.strategyId"
      :row-selection="{
        columnWidth: 40,
        selectedRowKeys: crud.selectedRowKeys,
        onChange: crud.selectionChangeHandler,
      }"
      size="small"
      style="width: 100%"
    >
      <template slot="operation" slot-scope="scope">
        <udOperation :data="scope" />
      </template>
    </a-table>
    <pagination class="pagination" />
    <eForm />
  </div>
</template>

<script>
  import CRUD, { presenter, crud } from '@crud/crud';
  import crudStrategyConfig from '@/api/strategyConfig';
  import eForm from './form';
  import crudOperation from '@crud/CRUD.operation';
  import udOperation from '@crud/UD.operation';
  import pagination from '@crud/Pagination';
  import eHeader from './header';
  import { downloadFileByURL } from '@/utils';
  import { buildDeletePayload } from './data';

  export default {
    name: 'TargetConfig',
    components: {
      eHeader,
      pagination,
      crudOperation,
      udOperation,
      eForm,
    },
    cruds() {
      return CRUD({
        url: '/push_engine/pushStrategy/selectPushStrategy',
        title: '策略',
        crudMethod: { ...crudStrategyConfig, buildDeletePayload },
        idField: 'strategyId',
        isBuildDeletePayload: true,
      });
    },
    mixins: [presenter(), crud()],
    data() {
      return {
        columns: Object.freeze([
          { title: 'ID', dataIndex: 'strategyId', ellipsis: true },
          { title: '推送数据', dataIndex: 'interfaceInfo', ellipsis: true, width: '22%' },
          {
            title: '接口编码',
            dataIndex: 'interfaceCode',
            width: '18%',
            ellipsis: true,
          },
          { title: '目标名称', dataIndex: 'targetName', ellipsis: true, width: '22%' },
          { title: '失败重推次数', dataIndex: 'pushAgainCount', ellipsis: true },
          {
            title: '操作',
            width: 60,
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
        del: true,
        download: false,
      };
    },
    methods: {
      downloadTpl() {
        const url = `${location.origin}/push_engine/pushStrategy/downPushStrategyTemplate`;
        downloadFileByURL(url, 'PushTemplate.groovy');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .pagination {
    position: fixed;
    right: 10px;
    bottom: 10px;
  }

  .info-icon {
    margin-right: 5px;
  }

  .text {
    color: red;
    font-size: 12px;
  }
</style>
