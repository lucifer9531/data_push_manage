<template>
  <div class="time-range-picker">
    <div>
      <a-time-picker
        :allowClear="false"
        :format="format"
        :value="range[0] ? moment(range[0], format) : null"
        class="startTime"
        @change="(val, dateStrings) => changeTime(val, dateStrings, 'start')"
      />
      <span class="ml10 mr10">{{ text }}</span>
      <a-time-picker
        :allowClear="false"
        :disabledHours="getDisabledHours"
        :disabledMinutes="getDisabledMinutes"
        :disabledSeconds="getDisabledSeconds"
        :format="format"
        :value="range[1] ? moment(range[1], format) : null"
        class="endTime"
        @change="(val, dateStrings) => changeTime(val, dateStrings, 'end')"
      />
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    model: {
      prop: 'range',
      event: 'returnBack',
    },
    props: {
      format: {
        type: String,
        default: 'HH:mm:ss',
      },
      text: {
        type: String,
        default: '至',
      },
      range: {
        type: Array,
        default: () => [],
        validator: function (value) {
          return value.length === 2;
        },
      },
    },
    data() {
      return {
        rangeInit: [],
      };
    },
    created() {
      this.rangeInit = JSON.parse(JSON.stringify(this.range));
    },
    methods: {
      moment,
      changeTime(val, dateStrings, type) {
        if (!dateStrings) {
          return this.$emit(
            'returnBack',
            type === 'start'
              ? [this.rangeInit[0], this.range[1]]
              : [this.range[0], this.rangeInit[1]],
          );
        }

        if (type === 'start') {
          const end = dateStrings >= this.range[1] ? dateStrings : this.range[1];
          this.$emit('returnBack', [dateStrings, end]);
        } else {
          this.$emit('returnBack', [this.range[0], dateStrings]);
        }
      },
      getDisabledParts(selected, baseTime, index) {
        const baseParts = baseTime.split(':').map(Number);
        const disabled = [];
        if (selected === baseParts[index]) {
          for (let i = 0; i < baseParts[index + 1]; i++) {
            disabled.push(i);
          }
        }
        return disabled;
      },
      getDisabledHours() {
        return this.getDisabledParts(null, this.range[0], 0);
      },
      getDisabledMinutes(selectedHour) {
        return this.getDisabledParts(selectedHour, this.range[0], 1);
      },
      getDisabledSeconds(selectedHour, selectedMinute) {
        return this.getDisabledParts(selectedMinute, this.range[0], 2);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .startTime,
  .endTime {
    width: 170px;
  }
</style>
