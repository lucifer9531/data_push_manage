<template>
  <luc-modal
    :centered="true"
    :footer="null"
    :maskClosable="false"
    :visible="visible"
    :width="900"
    show-full-screen
    title="推送结果详情"
    @cancel="() => (visible = false)"
  >
    <a-table
      ref="table"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="data.length ? { x: 1200, y: 550 } : {}"
      size="small"
      style="width: 100%"
    />
  </luc-modal>
</template>

<script>
  import LucModal from '@/components/Modal/index.vue';
  import { getResultShowDetail } from '@/api/dataDetails';

  export default {
    name: 'EDetails',
    components: { LucModal },
    data() {
      return {
        visible: false,
        data: [],
        columns: Object.freeze([
          {
            title: '原推送数据',
            dataIndex: 'originalData',
            ellipsis: true,
            customRender: (value) => {
              return JSON.stringify(value);
            },
          },
          {
            title: '最终推送数据',
            dataIndex: 'finalData',
            ellipsis: true,
            customRender: (value) => {
              return JSON.stringify(value);
            },
          },
          {
            title: '原推送结果',
            dataIndex: 'resultOriginalData',
            ellipsis: true,
            customRender: (value) => {
              return JSON.stringify(value);
            },
          },
          {
            title: '最终推送结果',
            dataIndex: 'resultFinalData',
            ellipsis: true,
            customRender: (value) => {
              return JSON.stringify(value);
            },
          },
          { title: '源接收时间', dataIndex: 'sourceReceiveTime', ellipsis: true, width: 180 },
          { title: '推送时间', dataIndex: 'resultTime', ellipsis: true, width: 180 },
          { title: '耗时(ms)', dataIndex: 'timeConsuming', ellipsis: true, width: 80 },
        ]),
        tableHeight: 0,
      };
    },
    mounted() {
      // window.addEventListener('resize', this.updateTableHeight);
    },
    beforeDestroy() {
      // window.removeEventListener('resize', this.updateTableHeight);
    },
    methods: {
      updateTableHeight() {
        const windowHeight = window.innerHeight;
        const offsetHeight = 230;
        this.tableHeight = windowHeight - offsetHeight;
      },
      async getResultShowDetail(scopeData) {
        this.data = [];
        const {
          data: { pushHistories },
        } = await getResultShowDetail({
          page: 1,
          limit: 10,
          ...scopeData,
        });
        this.data = pushHistories.map((item) => JSON.parse(item));
        // this.updateTableHeight();
      },
    },
  };
</script>
