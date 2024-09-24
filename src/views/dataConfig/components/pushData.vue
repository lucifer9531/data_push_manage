<template>
  <div style="margin-top: 8px">
    <div class="header">
      <a-input
        v-model="query.name"
        placeholder="接口名称或编码"
        style="width: 150px; margin-right: 10px"
      />
      <a-button class="mr10" type="primary" @click="search"> 查询 </a-button>
      <a-button type="primary" @click="toAdd"> 添加 </a-button>
    </div>
    <a-collapse v-if="data.length" accordion @change="changeCollapse">
      <a-collapse-panel
        v-for="item in data"
        :key="item.code"
        :header="`${item.code}(${item.info})`"
      >
        <a-form-model :label-col="labelCol" :model="form" :wrapper-col="wrapperCol">
          <a-form-model-item label="推送数据">
            <a-input v-model="form.info" disabled />
          </a-form-model-item>
          <a-form-model-item label="接口编码">
            <a-input v-model="form.code" disabled />
          </a-form-model-item>
          <a-form-model-item label="接口名称">
            <a-input v-model="form.name" disabled />
          </a-form-model-item>
          <a-form-model-item label="消息内容格式">
            <a-textarea v-model="form.format" :auto-size="{ maxRows: 12 }" />
            <a-button style="margin-top: 5px; float: right" type="primary" @click="save">
              保存
            </a-button>
          </a-form-model-item>
        </a-form-model>
        <a-button slot="extra" size="small" @click="handleClick($event, item)">删除</a-button>
      </a-collapse-panel>
    </a-collapse>
    <a-empty v-else />
    <e-form ref="eForm" />
  </div>
</template>

<script>
  import {
    deletePushInterface,
    editPushInterface,
    selectPushInterfaceById,
  } from '@/api/dataConfig';
  import eForm from './form.vue';
  export default {
    name: 'PushData',
    components: { eForm },
    props: {
      interfaceId: {
        type: String,
        default: '0',
      },
    },
    data() {
      return {
        data: [],
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        form: {},
        query: {
          name: '',
        },
      };
    },
    watch: {
      interfaceId: {
        handler(val) {
          if (!val) return;
          this.selectPushInterfaceById(val, this.query.name);
        },
        immediate: true,
      },
    },
    mounted() {
      this.selectPushInterfaceById();
    },
    methods: {
      handleClick(event, data) {
        event.stopPropagation();
        this.$confirm({
          title: '提示',
          content: `确认删除选中的接口吗?`,
          centered: true,
          onOk: () => {
            this.deletePushInterface(data);
          },
          cancel: () => {},
        });
      },
      async deletePushInterface(data) {
        const { interfaceId, code, name } = data;
        await deletePushInterface({
          name,
          interfaceId,
          interfaceCodes: code,
        });
        await this.search();
      },
      async selectPushInterfaceById(interfaceTypeId = '0', name = '') {
        this.data = [];
        const { data } = await selectPushInterfaceById({ interfaceTypeId, name });
        this.data = data;
      },
      changeCollapse(val) {
        this.form = this.data.find((item) => item.code === val) || {};
      },
      async save() {
        try {
          await editPushInterface(this.form);
          this.$message.success('修改成功');
          await this.search();
        } catch (err) {
          throw new Error(err);
        }
      },
      search() {
        this.selectPushInterfaceById(this.interfaceId || '0', this.query.name);
      },
      toAdd() {
        this.$refs.eForm.visible = true;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
</style>
