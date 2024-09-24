<template>
  <a-modal
    :centered="true"
    :footer="null"
    :maskClosable="false"
    :visible="visible"
    :width="520"
    title="选择人员"
    @cancel="visible = false"
  >
    <div style="height: 300px; overflow-y: auto">
      <a-table
        ref="table"
        :columns="columns"
        :data-source="crud.data"
        :loading="crud.loading"
        :pagination="false"
        :row-key="(row) => row.userId"
        size="small"
        style="width: 100%"
      >
        <template slot="operation" slot-scope="scope">
          <a class="grey" @click="addUser(scope)">
            <a-icon type="check" />
          </a>
        </template>
      </a-table>
      <pagination />
    </div>
  </a-modal>
</template>

<script>
  import CRUD, { crud, presenter } from '@crud/crud';
  import pagination from '@crud/Pagination.vue';

  export default {
    name: 'SelectUser',
    components: { pagination },
    mixins: [presenter(), crud()],
    props: {
      userList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        visible: false,
        columns: Object.freeze([
          { title: '姓名', dataIndex: 'name', ellipsis: true, width: 90 },
          {
            title: '手机号',
            dataIndex: 'phone',
            width: 120,
            ellipsis: true,
          },
          {
            title: '邮箱',
            dataIndex: 'mailBox',
            ellipsis: true,
          },
          {
            title: '操作',
            width: 60,
            scopedSlots: { customRender: 'operation' },
            fixed: 'right',
          },
        ]),
      };
    },
    cruds() {
      return CRUD({
        url: '/push_engine/pushUser/selectPushUserAll',
        idField: 'userId',
      });
    },
    methods: {
      addUser(data) {
        const index = this.userList.findIndex((item) => item.userId === data.userId);
        if (index > -1) {
          this.$message.info('已添加此人员，请选择其他人！');
          return;
        }
        this.$emit('noticeUser', data);
        this.visible = false;
      },
    },
  };
</script>
