<template>
  <div class="search-box-container">
    <a-input
      v-model.trim="query.name"
      placeholder="请输入目标名称"
      style="width: 180px; margin-right: 10px"
    />
    <a-select
      v-model="query.type"
      allowClear
      placeholder="请选择接口类型"
      style="width: 180px; margin-right: 10px"
      @change="crud.toQuery"
    >
      <a-select-option v-for="item in httpEnum" :key="item.id" :value="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <rrOperation />
  </div>
</template>

<script>
  import rrOperation from '@crud/RR.operation';
  import { header } from '@crud/crud';
  import { httpEnum } from './data';

  export default {
    name: 'EHeader',
    components: { rrOperation },
    mixins: [header()],
    data() {
      return {
        httpEnum,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .search-box-container {
    display: flex;
  }
</style>
