<template>
  <div class="search-box-container">
    <a-date-picker
      v-model="query.alertTimestamp"
      placeholder="告警时间"
      show-time
      style="width: 180px; margin-right: 10px"
      value-format="YYYY-MM-DD HH:mm:ss"
      @change="handleDateChange"
    />
    <a-select
      v-model="query.sendType"
      allowClear
      placeholder="告警方式"
      style="width: 180px; margin-right: 10px"
      @change="crud.toQuery"
    >
      <a-select-option v-for="item in alertTypeEnum()" :key="item.id" :value="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
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
      v-model="query.userId"
      allowClear
      placeholder="通知人员"
      style="width: 180px; margin-right: 10px"
      @change="crud.toQuery"
    >
      <a-select-option v-for="item in noticeUser" :key="item.userId" :value="item.userId">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <a-select
      v-model="query.sendResult"
      allowClear
      placeholder="通知结果"
      style="width: 180px; margin-right: 10px"
      @change="crud.toQuery"
    >
      <a-select-option v-for="item in noticeResultEnum()" :key="item.id" :value="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <rrOperation />
  </div>
</template>

<script>
  import rrOperation from '@crud/RR.operation';
  import { header } from '@crud/crud';
  import { alertTypeEnum, levelEnum, noticeResultEnum } from '../data';
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
      noticeResultEnum() {
        return noticeResultEnum;
      },
      alertTypeEnum() {
        return alertTypeEnum;
      },
      levelEnum() {
        return levelEnum;
      },
      async getSelectPushUserAllNotPage() {
        const { data } = await getSelectPushUserAllNotPage();
        this.noticeUser = data;
      },
      handleDateChange(date) {
        if (date) this.query.alertTime = new Date(date).getTime();
        else this.query.alertTime = null;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .search-box-container {
    display: flex;
  }
</style>
