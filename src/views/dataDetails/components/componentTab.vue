<template>
  <div class="app-container">
    <a-tabs v-model="currentTab" @tabClick="tabClick">
      <a-tab-pane v-for="item in tabData" :key="item.key" :tab="item.name">
        <keep-alive>
          <component :is="currentComponent" v-if="item.key === currentTab" />
        </keep-alive>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import { defineAsyncComponent } from 'vue';
  import Result from './result';

  const Statistics = defineAsyncComponent(() => import('./statistics'));
  const RePush = defineAsyncComponent(() => import('./rePush'));
  export default {
    name: 'ComponentTab',
    components: {
      Result,
    },
    data() {
      return {
        currentTab: 'result',
        tabData: Object.freeze([
          { key: 'result', name: '推送结果' },
          { key: 'statistics', name: '结果统计' },
          { key: 'error', name: '平台异常重推' },
        ]),
      };
    },
    computed: {
      // eslint-disable-next-line vue/return-in-computed-property
      currentComponent() {
        switch (this.currentTab) {
          case 'result':
            return Result;
          case 'statistics':
            return Statistics;
          case 'error':
            return RePush;
          default:
            break;
        }
      },
    },
    methods: {
      tabClick(tab) {
        this.currentTab = tab;
      },
    },
  };
</script>
