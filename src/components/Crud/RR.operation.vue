<!--搜索与重置-->
<template>
  <span>
    <a-button class="btn" @click="crud.toQuery">
      <a-icon type="search" />
    </a-button>
    <a-button
      v-if="crud.optShow.reset"
      class="btn"
      style="margin-left: 5px"
      @click="crud.resetQuery()"
    >
      <a-icon type="reload" />
    </a-button>
  </span>
</template>
<script>
  import { crud } from '@crud/crud';
  export default {
    mixins: [crud()],
    props: {
      itemClass: {
        type: String,
        required: false,
        default: '',
      },
    },
  };
</script>

<style lang="scss" scoped>
  .btn {
    min-width: 35px;
  }
</style>
