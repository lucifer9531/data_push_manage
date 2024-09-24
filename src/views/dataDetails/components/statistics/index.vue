<template>
  <a-tabs v-model="currentTab" tab-position="left" @tabClick="tabClick">
    <a-tab-pane v-for="item in tabData" :key="item.key" :tab="item.name">
      <statistics-chart ref="statisticsChart" :tab-key="currentTab" />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
  import statisticsChart from './statisticsChart.vue';
  export default {
    name: 'Index',
    components: { statisticsChart },
    data() {
      return {
        currentTab: 'dataSource',
        tabData: Object.freeze([
          { key: 'dataSource', name: '源数据调用' },
          { key: 'strategy', name: '策略执行' },
          { key: 'target', name: '目标地址调用' },
        ]),
      };
    },
    methods: {
      tabClick(val) {
        this.$nextTick(() => {
          this.currentTab = val;
        });
      },
    },
  };
</script>
