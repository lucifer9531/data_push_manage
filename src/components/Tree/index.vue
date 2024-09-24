<template>
  <div style="position: relative; height: 100%; overflow-y: auto">
    <a-tree
      v-if="treeData.length"
      v-model="checkedKeys"
      :checkStrictly="checkStrictly"
      :checkable="checkable"
      :replace-fields="replaceFields"
      :selected-keys="defaultSelect"
      :treeData="treeData"
      defaultExpandAll
      @check="checkedChange"
      @dblclick="onDoubleClick"
      @select="onSelect"
    >
      <template slot="custom" slot-scope="item">
        <div :title="item.title" class="ellipsis label-cell">{{ item.title }}</div>
        <div v-if="operate" class="operate operate-cell" style="color: #fff">
          <a-icon
            v-if="enableCopy"
            style="margin-right: 5px"
            title="复制"
            type="copy"
            @click.stop="orgCopy(item)"
          />
          <a-icon style="margin-right: 5px" title="新增" type="plus" @click.stop="orgAdd(item)" />
          <a-icon
            v-if="item.parentId && item.parentId !== -1"
            style="margin-right: 5px"
            title="修改"
            type="edit"
            @click.stop="orgEdit(item)"
          />
          <a-icon
            v-if="item.parentId && item.parentId !== -1"
            title="删除"
            type="delete"
            @click.stop="orgDelete(item)"
          />
        </div>
      </template>
    </a-tree>
  </div>
</template>
<script>
  export default {
    props: {
      treeData: {
        type: Array,
        default: () => [{ id: 1, key: 1, title: '空节点', pId: 0 }],
      },
      dialog: {
        type: Boolean,
        default: false,
      },
      checkable: {
        type: Boolean,
        default: false,
      },
      checkStrictly: {
        type: Boolean,
        default: false,
      },
      defaultCheckedKeys: {
        type: Array,
        default: () => [],
      },
      enableCopy: {
        type: Boolean,
        default: false,
      },
      operate: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        replaceFields: {
          key: 'id',
        },
        defaultSelect: ['0-0'],
        checkedKeys: [],
      };
    },
    methods: {
      onSelect(selectedKeys, e) {
        this.$set(this, 'defaultSelect', selectedKeys);
        this.$emit('select', e.node.dataRef);
      },
      onDoubleClick(selectedKeys, e) {
        this.$emit('dblclick', e._self.dataRef);
      },
      orgAdd(item) {
        const data = item;
        data.edit = false;
        this.$emit('edit', data);
      },
      orgCopy(item) {
        const data = item;
        this.$emit('copy', data);
      },
      orgEdit(item) {
        const data = item;
        data.edit = true;
        this.$emit('edit', data);
      },
      orgDelete(data) {
        this.$confirm({
          title: '提示',
          centered: true,
          content: '数据删除不可恢复，其下子节点也会被删除，是否确认删除？',
          onOk: () => {
            this.$emit('del', data);
          },
        });
      },
      checkedChange(checkedKeys, { checked, node }) {
        const t = node.$options.propsData;
        this.$emit('check', checkedKeys, { checked, data: t.dataRef });
      },
    },
  };
</script>

<style lang="scss" scoped>
  ::v-deep.ant-tree-title {
    .operate-cell {
      width: 67px;
    }
  }
</style>
