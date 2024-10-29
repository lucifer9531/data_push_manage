<template>
  <div style="margin-top: 8px">
    <div class="header">
      <a-input-search
        v-model="query.name"
        placeholder="请输入名称或编码"
        style="width: 240px; margin-top: -10px; margin-right: 10px"
        @search="search"
      />
      <crudOperation />
    </div>
    <div class="line"></div>
    <a-table
      ref="table"
      :columns="columns"
      :data-source="paginatedData"
      :loading="crud.loading"
      :pagination="false"
      :row-key="(row) => row.interfaceId"
      size="small"
      style="width: 100%"
    >
      <template slot="operation" slot-scope="scope">
        <udOperation :data="scope" />
      </template>
    </a-table>
    <a-pagination
      :current="page.page"
      :page-size.sync="page.size"
      :show-total="(total) => `共${total}条`"
      :total="page.total"
      class="ant-table-pagination pagination"
      show-quick-jumper
      show-size-changer
      @change="pageChangeHandler"
      @showSizeChange="sizeChangeHandler"
    />
    <e-form ref="eForm" />
  </div>
</template>

<script>
  import eForm from './form.vue';
  import udOperation from '@crud/UD.operation.vue';
  import CRUD, { crud, presenter } from '@crud/crud';
  import crudDataConfig from '@/api/dataConfig';
  import crudOperation from '@crud/CRUD.operation.vue';
  import { buildDeletePayload } from './data';
  export default {
    name: 'PushData',
    components: { crudOperation, udOperation, eForm },
    mixins: [presenter(), crud()],
    props: {
      interfaceId: {
        type: String,
        default: '0',
      },
    },
    cruds() {
      return CRUD({
        title: '接口',
        url: '/push_engine/pushInterface/selectPushInterfaceById',
        crudMethod: { ...crudDataConfig, buildDeletePayload },
        idField: 'interfaceId',
        queryOnPresenterCreated: false,
        isBuildDeletePayload: true,
      });
    },
    data() {
      return {
        columns: Object.freeze([
          {
            title: '序号',
            width: 60,
            ellipsis: true,
            customRender: (value, row, index) => {
              return (this.page.page - 1) * this.page.size + index + 1;
            },
          },
          {
            title: '配置名称',
            ellipsis: true,
            customRender: (_, row) => {
              return `${row.code}(${row.info})`;
            },
          },
          {
            title: '操作',
            width: 60,
            scopedSlots: { customRender: 'operation' },
            fixed: 'right',
          },
        ]),
        query: {
          name: '',
        },
        page: {
          page: 1,
          size: 10,
          total: 0,
        },
      };
    },
    computed: {
      paginatedData() {
        const start = (this.page.page - 1) * this.page.size;
        const end = start + this.page.size;
        return this.crud.data.slice(start, end);
      },
    },
    watch: {
      interfaceId: {
        handler(val) {
          if (!val) return;
          this.selectPushInterfaceById(val, this.query.name);
        },
        immediate: true,
      },
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
    mounted() {
      this.selectPushInterfaceById();
    },
    methods: {
      [CRUD.HOOK.afterRefresh]() {
        this.page.total = this.crud.data.length;
      },
      pageChangeHandler(page, size) {
        this.page.page = page;
        this.page.size = size;
      },
      sizeChangeHandler(_, size) {
        this.page.size = size;
        this.page.page = 1;
      },
      async selectPushInterfaceById(interfaceTypeId = '0', name = '') {
        this.crud.query.interfaceTypeId = interfaceTypeId;
        this.crud.query.name = name;
        this.crud.toQuery();
      },
      search() {
        this.selectPushInterfaceById(this.interfaceId || '0', this.query.name);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 10px;
  }

  .line {
    width: calc(100% + 10px);
    height: 1px;
    margin-top: -10px;
    margin-bottom: 10px;
    margin-left: -10px;
    background: #e2e5eb;
  }

  .pagination {
    position: fixed;
    right: 10px;
    bottom: 10px;
  }
</style>
