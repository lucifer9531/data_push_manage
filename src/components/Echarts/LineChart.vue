<template>
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>

<script>
  import echarts from 'echarts';
  require('echarts/theme/macarons');
  import resize from '@/mixins/resize';

  const animationDuration = 300;

  export default {
    name: 'LineChart',
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart',
      },
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '400px',
      },
      autoResize: {
        type: Boolean,
        default: true,
      },
      chartData: {
        type: Object,
        required: true,
        default: () => ({
          legendData: [],
          axisData: [],
          seriesData: [],
        }),
      },
    },
    data() {
      return {
        chart: null,
      };
    },
    watch: {
      chartData: {
        handler(val) {
          this.$nextTick(() => {
            this.resetChart();
            this.setOptions(val);
          });
        },
        deep: true,
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart();
      });
    },
    beforeDestroy() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      initChart() {
        if (this.chart) {
          this.chart.dispose();
        }
        this.chart = echarts.init(this.$el, 'macarons');
      },
      resetChart() {
        if (this.chart) {
          this.chart.dispose();
          this.chart = null;
        }
        this.initChart();
      },
      setOptions() {
        const { legendData, axisData, seriesData } = this.chartData;
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            data: legendData,
          },
          grid: {
            top: 25,
            left: '2%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: axisData,
              axisTick: {
                alignWithLabel: true,
              },
              splitLine: {
                show: false,
              },
              splitArea: {
                show: false,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: legendData[0],
              type: 'line',
              data: seriesData[0],
              animationDuration,
            },
            {
              name: legendData[1],
              type: 'line',
              data: seriesData[1],
              animationDuration,
            },
          ],
        });
      },
    },
  };
</script>
