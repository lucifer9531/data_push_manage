<template>
  <div>
    <slot name="left"></slot>
    <a :loading="crud.status.cu === 2" class="grey mr10" @click.stop="crud.toEdit(data)">
      <a-icon type="edit" />
    </a>
    <a class="grey" @click="toDelete">
      <a-icon type="delete" />
    </a>
  </div>
</template>
<script>
  import { crud } from '@crud/crud';
  export default {
    mixins: [crud()],
    props: {
      data: {
        type: Object,
        required: true,
      },
      disabledEdit: {
        type: Boolean,
        default: false,
      },
      disabledDle: {
        type: Boolean,
        default: false,
      },
      msg: {
        type: String,
        default: '数据删除不可恢复，是否确认删除？',
      },
      title: {
        type: String,
        default: '提示',
      },
      okText: {
        type: String,
        default: '确定',
      },
      cancelText: {
        type: String,
        default: '取消',
      },
      type: {
        type: String,
        default: 'warning',
      },
      centered: {
        type: Boolean,
        default: true,
      },
    },
    methods: {
      doCancel() {
        this.crud.cancelDelete(this.data);
      },
      toDelete() {
        this.$confirm({
          title: '提示',
          content: this.msg,
          cancelText: this.cancelText,
          okText: this.okText,
          centered: this.centered,
          onOk: () => {
            this.crud.doDelete(this.data);
          },
          cancel: () => {
            this.doCancel();
          },
        });
      },
    },
  };
</script>
