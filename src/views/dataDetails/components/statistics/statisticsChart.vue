<template>
  <div class="page-container">
    <div class="header-container">
      <a-select
        v-model="query.timeGranularity"
        style="width: 120px; margin-right: 10px"
        @change="handleChange"
      >
        <a-select-option v-for="item in timeGranularityOptions" :key="item.id" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
      <a-date-picker
        v-if="query.timeGranularity === 1"
        v-model="query.startTime"
        format="YYYY-MM-DD"
        style="width: 150px; margin-right: 10px"
        value-format="YYYY-MM-DD"
      />
      <a-month-picker
        v-else
        v-model="query.startTime"
        format="YYYY-MM"
        style="width: 150px; margin-right: 10px"
        value-format="YYYY-MM"
      />
      <a-select v-model="query.interfaceId" style="width: 180px; margin-right: 10px">
        <a-select-option
          v-for="item in interfaceOptions"
          :key="item.interfaceId"
          :value="item.interfaceId"
        >
          {{ item.interfaceCode }}
        </a-select-option>
      </a-select>
      <a-button type="primary" @click="statistics">统计</a-button>
    </div>
    <div class="container">
      <line-chart :chart-data="chartData" />
    </div>
  </div>
</template>

<script>
  import {
    getSelectSourceDataStatistics,
    getSelectStrategyDown,
    getSelectStrategyStatistics,
    getSelectTargetStatistics,
  } from '@/api/dataDetails';
  import moment from 'moment';
  import LineChart from '@/components/Echarts/LineChart.vue';

  export default {
    name: 'StatisticsChart',
    components: { LineChart },
    props: {
      tabKey: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        timeGranularityOptions: Object.freeze([
          { id: 1, name: '天粒度' },
          { id: 2, name: '月粒度' },
        ]),
        interfaceOptions: [],
        query: {
          timeGranularity: 1,
          startTime: moment().format('YYYY-MM-DD'),
          interfaceId: '',
        },
        chartData: {},
      };
    },
    async mounted() {
      await this.getSelectStrategyDown();
      await this.statistics();
    },
    methods: {
      handleChange() {
        this.query.startTime = moment().format(
          this.query.timeGranularity === 1 ? 'YYYY-MM-DD' : 'YYYY-MM',
        );
      },
      async getSelectSourceDataStatistics() {
        const { data } = await getSelectSourceDataStatistics(this.query);
        this.handleData(data);
      },
      async getSelectStrategyStatistics() {
        const strategyId =
          this.interfaceOptions.find((item) => item.interfaceId === this.query.interfaceId)
            ?.strategyId || '';
        const { data } = await getSelectStrategyStatistics({
          timeGranularity: this.query.timeGranularity,
          startTime: this.query.startTime,
          strategyId,
        });
        this.handleData(data);
      },
      async getSelectTargetStatistics() {
        const targetId =
          this.interfaceOptions.find((item) => item.interfaceId === this.query.interfaceId)
            ?.targetId || '';
        const { data } = await getSelectTargetStatistics({
          timeGranularity: this.query.timeGranularity,
          startTime: this.query.startTime,
          targetId,
        });
        this.handleData(data);
      },
      handleData(data) {
        const { title, xTime, yResultStatistics } = data;
        this.chartData = {
          legendData: title,
          axisData: xTime,
          seriesData: yResultStatistics,
        };
      },
      async statistics() {
        switch (this.tabKey) {
          case 'strategy':
            await this.getSelectStrategyStatistics();
            break;
          case 'target':
            await this.getSelectTargetStatistics();
            break;
          default:
            await this.getSelectSourceDataStatistics();
            break;
        }
      },
      async getSelectStrategyDown() {
        const { data } = await getSelectStrategyDown();
        this.interfaceOptions = data;
        this.query.interfaceId = data[0]?.interfaceId || '';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .page-container {
    margin-left: 50%;
    transform: translateX(-50%);

    .header-container {
      display: flex;
    }

    .container {
      margin-top: 12px;
    }
  }
</style>
