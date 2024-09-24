<template>
  <div class="search-box-container">
    <a-input
      v-model.trim="query.name"
      placeholder="告警名称"
      style="width: 180px; margin-right: 10px"
    />
    <a-select
      v-model="query.level"
      allowClear
      placeholder="告警级别"
      style="width: 180px; margin-right: 10px"
      @change="crud.toQuery"
    >
      <a-select-option v-for="item in levelEnum()" :key="item.id" :value="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <a-select
      v-model="query.noticeName"
      allowClear
      placeholder="通知人员"
      style="width: 180px; margin-right: 10px"
      @change="crud.toQuery"
    >
      <a-select-option v-for="item in noticeUser" :key="item.userId" :value="item.userId">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <rrOperation />
  </div>
</template>

<script>
  import rrOperation from '@crud/RR.operation';
  import { header } from '@crud/crud';
  import { levelEnum } from '../data';
  import { getSelectPushUserAllNotPage } from '@/api/monitor';

  export default {
    name: 'EHeader',
    components: { rrOperation },
    mixins: [header()],
    data() {
      return {
        noticeUser: [],
      };
    },
    mounted() {
      this.getSelectPushUserAllNotPage();
    },
    methods: {
      levelEnum() {
        return levelEnum;
      },
      async getSelectPushUserAllNotPage() {
        const { data } = await getSelectPushUserAllNotPage();
        this.noticeUser = data;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .search-box-container {
    display: flex;
  }
</style>
