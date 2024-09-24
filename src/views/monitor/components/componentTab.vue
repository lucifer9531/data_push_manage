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
  import Config from './config';
  const Result = defineAsyncComponent(() => import('./result'));
  export default {
    name: 'ComponentTab',
    components: {
      Config,
    },
    data() {
      return {
        currentTab: 'config',
        tabData: Object.freeze([
          { key: 'config', name: '监控告警配置' },
          { key: 'result', name: '监控告警结果' },
        ]),
      };
    },
    computed: {
      // eslint-disable-next-line vue/return-in-computed-property
      currentComponent() {
        switch (this.currentTab) {
          case 'config':
            return Config;
          case 'result':
            return Result;
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
