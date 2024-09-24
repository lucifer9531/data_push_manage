<template>
  <luc-modal
    :centered="true"
    :maskClosable="false"
    :visible="visible"
    :width="600"
    show-full-screen
    title="添加接口"
    @cancel="cancel"
    @ok="ok"
  >
    <a-form-model
      ref="form"
      :label-col="labelCol"
      :model="form"
      :rules="rules"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="推送数据" prop="info">
        <a-select
          v-model="form.info"
          placeholder="请选择推送数据"
          style="width: 100%"
          @change="handleChange"
        >
          <a-select-option
            v-for="item in interfaceOptions"
            :key="item.dataSourcesId"
            :value="item.info"
          >
            {{ item.info }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="接口编码" prop="code">
        <a-input
          v-model="form.code"
          placeholder="请输入接口编码(如：企业Id_CALL_DETAILS_PUSH)"
          @change="checkName"
        />
      </a-form-model-item>
      <a-form-model-item label="接口名称">
        <a-input v-model="form.name" disabled placeholder="选择推送数据后自动填充" />
      </a-form-model-item>
      <a-form-model-item label="消息内容格式">
        <a-textarea
          v-model="form.format"
          :auto-size="{ maxRows: 12 }"
          placeholder="消息内容格式：{'xxx':'xxx','xxx':'xxx'}"
        />
      </a-form-model-item>
    </a-form-model>
  </luc-modal>
</template>

<script>
  import LucModal from '@/components/Modal/index.vue';
  import {
    addPushInterface,
    checkInterfaceCode,
    getSelectPushDataSourcesDown,
  } from '@/api/dataConfig';
  import _ from 'lodash';

  export default {
    name: 'Form',
    components: { LucModal },
    data() {
      return {
        visible: false,
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        interfaceOptions: [],
        isExistName: false,
        form: {},
        rules: {
          info: [{ required: true, message: '请选择推送数据', trigger: 'change' }],
          code: [{ required: true, validator: this.validateName, trigger: 'blur' }],
        },
      };
    },
    mounted() {
      this.getSelectPushDataSourcesDown();
    },
    methods: {
      async getSelectPushDataSourcesDown() {
        const { data } = await getSelectPushDataSourcesDown();
        this.interfaceOptions = data;
      },
      validateName(rule, value, callback) {
        if (!value) {
          callback(new Error('接口编码不能为空'));
        } else if (!this.isExistName) {
          callback(new Error('接口编码已存在'));
        } else {
          callback();
        }
      },
      checkName: _.debounce(async function () {
        const { status } = await checkInterfaceCode({ code: this.form.code, editId: 0 });
        this.isExistName = status === 0;
      }, 300),
      handleChange(val) {
        const { beanName, format } = this.interfaceOptions.find((item) => item.info === val);
        this.form.name = beanName;
        this.form.format = format;
      },
      resetForm() {
        this.form = {};
      },
      ok() {
        this.$refs.form.validate(async (valid) => {
          if (!valid) return;
          try {
            await addPushInterface({
              ...this.form,
              interfaceTypeId: this.$parent.interfaceId || '0',
            });
            await this.$parent.search();
            this.visible = false;
            this.resetForm();
          } catch (err) {
            throw new Error(err);
          }
        });
      },
      cancel() {
        this.visible = false;
        this.resetForm();
      },
    },
  };
</script>
