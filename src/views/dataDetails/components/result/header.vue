<template>
  <div class="search-box-container">
    <a-input
      v-model.trim="query.sessionId"
      placeholder="会话ID"
      style="width: 200px; margin-right: 10px"
    />
    <a-range-picker
      v-model="query.time"
      :disabled-date="disabledDate"
      :placeholder="['开始时间', '结束时间']"
      :show-time="{
        hideDisabledOptions: true,
        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
      }"
      style="width: 380px; margin-right: 10px"
      value-format="YYYY-MM-DD HH:mm:ss"
    />
    <a-button class="btn mr10" @click="crud.toQuery">
      <a-icon type="search" />
    </a-button>
    <a-popover placement="bottomRight" trigger="click">
      <template slot="content">
        <a-row>
          <a-col :span="6">
            <a-select
              v-model="query.interfaceId"
              allowClear
              placeholder="接口编码"
              style="width: 150px; margin-right: 10px"
              @change="crud.toQuery"
            >
              <a-select-option
                v-for="item in interfaceOptions"
                :key="item.interfaceId"
                :value="item.interfaceId"
              >
                {{ item.code }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-select
              v-model="query.targetId"
              allowClear
              placeholder="目标名称"
              style="width: 150px; margin-right: 10px"
              @change="crud.toQuery"
            >
              <a-select-option
                v-for="item in targetOptions"
                :key="item.targetId"
                :value="item.targetId"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-select
              v-model="query.pushStatus"
              allowClear
              placeholder="推送状态"
              style="width: 150px; margin-right: 10px"
              @change="crud.toQuery"
            >
              <a-select-option v-for="item in pushStatusEnum()" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-select
              v-model="query.pushType"
              allowClear
              placeholder="推送类型"
              style="width: 150px; margin-right: 10px"
              @change="crud.toQuery"
            >
              <a-select-option v-for="item in pushTypeEnum()" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </template>
      <a-button class="btn">
        <a-icon type="filter" />
      </a-button>
    </a-popover>
  </div>
</template>

<script>
  import { header } from '@crud/crud';
  import { getInterfaceData, getTargetData } from '@/api/strategyConfig';
  import { pushStatusEnum, pushTypeEnum } from '@/views/dataDetails/components/result/data';
  import moment from 'moment';

  export default {
    name: 'EHeader',
    mixins: [header()],
    data() {
      return {
        visible: false,
        interfaceOptions: [],
        targetOptions: [],
      };
    },
    watch: {
      'crud.query.time'() {
        if (this.crud.query.time) {
          this.crud.query.startTime = this.crud.query.time[0];
          this.crud.query.endTime = this.crud.query.time[1];
        } else {
          delete this.crud.query.startTime;
          delete this.crud.query.endTime;
          this.crud.toQuery();
        }
      },
    },
    mounted() {
      this.getInterfaceData();
      this.getTargetData();
    },
    methods: {
      moment,
      disabledDate(current) {
        return current && current > new Date().getTime();
      },
      pushTypeEnum() {
        return pushTypeEnum;
      },
      pushStatusEnum() {
        return pushStatusEnum;
      },
      async getInterfaceData() {
        const { data } = await getInterfaceData();
        this.interfaceOptions = data;
      },
      async getTargetData() {
        const { data } = await getTargetData();
        this.targetOptions = data;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .search-box-container {
    display: flex;
  }

  .btn {
    min-width: 35px;
  }
</style>
