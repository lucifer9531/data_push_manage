<template>
  <div class="crud-opts">
    <a-button
      v-if="crud.optShow.del"
      :disabled="crud.selections.length === 0"
      :loading="crud.delAllLoading"
      type="primary"
      @click="toDelete(crud.selections)"
    >
      批量删除
    </a-button>
    <slot name="del-btn-right"></slot>
    <span class="crud-opts-left fr">
      <slot name="left"></slot>
      <a-button v-if="crud.optShow.add" type="primary" @click="crud.toAdd"> 新增 </a-button>
      <a-button
        v-if="crud.optShow.edit"
        :disabled="crud.selections.length !== 1"
        class="filter-item"
        icon="edit"
        type="success"
        @click="crud.toEdit(crud.selections[0])"
      >
        修改
      </a-button>
      <el-button
        v-if="crud.optShow.download"
        :disabled="!crud.data.length"
        :loading="crud.downloadLoading"
        class="filter-item"
        icon="download"
        type="warning"
        @click="crud.doExport"
        >导出</el-button
      >
      <slot name="right"></slot>
    </span>
  </div>
</template>
<script>
  import { crud } from '@crud/crud';

  export default {
    mixins: [crud()],
    props: {
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
    },
    methods: {
      toDelete(datas) {
        this.$confirm({
          title: this.title,
          content: `确认删除选中的${datas.length}条数据?`,
          cancelText: this.cancelText,
          okText: this.okText,
          centered: this.centered,
          onOk: () => {
            this.crud.delAllLoading = true;
            this.crud.doDelete(datas);
          },
          cancel: () => {},
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .crud-opts .crud-opts-left {
    margin-bottom: 10px;
  }

  .crud-opts .crud-opts-right {
    margin-left: auto;
  }

  .crud-opts .crud-opts-right span {
    float: left;
  }

  .crud-opts {
    &::after {
      content: '';
      display: table;
      clear: both;
    }
  }
</style>
