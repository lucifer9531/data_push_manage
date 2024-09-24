<template>
  <div class="page-container">
    <div class="left">
      <luc-tree
        :tree-data="treeData"
        @del="onDel($event)"
        @edit="onEdit($event)"
        @select="select($event)"
      />
    </div>
    <div class="right">
      <push-data ref="pushData" :interface-id="currentInterfaceTypeId" />
    </div>
    <tree-modal ref="treeModal" />
  </div>
</template>

<script>
  import lucTree from '@/components/Tree';
  import treeModal from './components/treeModal.vue';
  import pushData from './components/pushData.vue';
  import { deleteSourceDataTree, getTreeData } from '@/api/dataConfig';
  export default {
    name: 'Index',
    components: {
      lucTree,
      treeModal,
      pushData,
    },
    data() {
      return {
        currentInterfaceTypeId: '',
        treeData: [
          {
            title: '全部接口',
            interfaceTypeId: '0',
            parentId: -1,
            children: [],
            scopedSlots: {
              title: 'custom',
              node: { parentId: -1, title: '全部接口', id: 0, interfaceTypeId: '0' },
            },
          },
        ],
      };
    },
    mounted() {
      this.getTreeData();
    },
    methods: {
      resetTreeData() {
        this.treeData = [
          {
            title: '全部接口',
            interfaceTypeId: '0',
            parentId: -1,
            children: [],
            scopedSlots: { title: 'custom', node: { parentId: -1 } },
          },
        ];
      },
      async getTreeData() {
        this.resetTreeData();
        const { data } = await getTreeData();
        const addScopedSlots = (node) => {
          node.scopedSlots = { title: 'custom', node: node };
          if (node.children && node.children.length) {
            node.children.forEach((child) => {
              addScopedSlots(child);
            });
          }
        };
        data.forEach((item) => {
          addScopedSlots(item);
          this.treeData[0].children.push(item);
        });
      },
      onEdit(data) {
        this.$refs.treeModal.handleData(data);
      },
      async onDel(data) {
        await deleteSourceDataTree({ interfaceTypeId: data.interfaceTypeId });
        await this.getTreeData();
      },
      select(data) {
        this.currentInterfaceTypeId = data.interfaceTypeId;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .page-container {
    display: flex;
    padding: 10px;

    .left {
      width: 240px;
      height: 100%;
      margin-top: 10px;
      padding-right: 10px;
    }

    .right {
      flex: 1;
    }
  }
</style>
