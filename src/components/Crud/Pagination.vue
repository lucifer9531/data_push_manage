<!--分页-->
<template>
  <a-pagination
    :current="page.page"
    :page-size.sync="page.size"
    :show-total="(total) => `共${total}条`"
    :total="page.total"
    class="ant-table-pagination"
    show-quick-jumper
    show-size-changer
    @change="crud.pageChangeHandler"
    @showSizeChange="crud.sizeChangeHandler"
  />
</template>
<script>
  import { pagination } from '@crud/crud';
  export default {
    mixins: [pagination()],
  };
</script>
