<template>
  <div class="search-box-container">
    <a-select
      v-model="query.interfaceId"
      allowClear
      placeholder="接口编码"
      style="width: 180px; margin-right: 10px"
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
    <a-select
      v-model="query.targetId"
      allowClear
      placeholder="目标名称"
      style="width: 180px; margin-right: 5px"
      @change="crud.toQuery"
    >
      <a-select-option v-for="item in targetOptions" :key="item.targetId" :value="item.targetId">
        {{ item.name }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
  import { header } from '@crud/crud';
  import { getInterfaceData, getTargetData } from '@/api/strategyConfig';

  export default {
    name: 'EHeader',
    mixins: [header()],
    data() {
      return {
        interfaceOptions: [],
        targetOptions: [],
      };
    },
    mounted() {
      this.getInterfaceData();
      this.getTargetData();
    },
    methods: {
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
</style>
