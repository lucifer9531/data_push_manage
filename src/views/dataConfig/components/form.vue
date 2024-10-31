<template>
  <luc-modal
    :centered="true"
    :maskClosable="false"
    :title="crud.status.title"
    :visible="crud.status.cu > 0"
    :width="850"
    show-full-screen
    @cancel="crud.cancelCU"
  >
    <a-form-model
      ref="form"
      :label-col="labelCol"
      :model="form"
      :rules="rules"
      :wrapper-col="wrapperCol"
    >
      <div style="display: flex; justify-content: flex-start">
        <a-form-model-item label="推送数据" prop="info">
          <a-select
            v-model="form.info"
            :disabled="crud.status.edit > 0"
            class="mr10"
            placeholder="请选择推送数据"
            style="width: 260px"
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
            :disabled="crud.status.edit > 0"
            class="mr10"
            placeholder="请输入接口编码(如：企业Id_CALL_DETAILS_PUSH)"
            style="width: 260px"
            @change="checkName"
          />
        </a-form-model-item>
        <a-form-model-item label="接口名称">
          <a-input
            v-model="form.name"
            disabled
            placeholder="选择推送数据后自动填充"
            style="width: 260px"
          />
        </a-form-model-item>
      </div>
      <a-form-model-item label="消息内容格式">
        <a-textarea
          v-model="form.format"
          :auto-size="{ minRows: 12, maxRows: 12 }"
          placeholder="消息内容格式：{'xxx':'xxx','xxx':'xxx'}"
        />
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button @click="crud.cancelCU">取消</a-button>
      <a-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">
        确定
      </a-button>
    </template>
  </luc-modal>
</template>

<script>
  import LucModal from '@/components/Modal/index.vue';
  import { checkInterfaceCode, getSelectPushDataSourcesDown } from '@/api/dataConfig';
  import _ from 'lodash';
  import CRUD, { form } from '@crud/crud';

  const defaultForm = {
    code: '',
    format: '',
    info: undefined,
    interfaceTypeId: '',
    name: '',
  };

  export default {
    name: 'Form',
    components: { LucModal },
    mixins: [form(defaultForm)],
    data() {
      return {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
        interfaceOptions: [],
        isExistName: false,
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
        } else if (this.crud.status.add > 0 && !this.isExistName) {
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
      [CRUD.HOOK.beforeToAdd]() {
        for (const _key in this.form) {
          !Object.hasOwnProperty.call(defaultForm, _key) && delete this.form[_key];
        }
      },
      [CRUD.HOOK.beforeSubmit]() {
        this.form.interfaceTypeId = this.$parent.interfaceId || '0';
      },
      [CRUD.HOOK.afterSubmit]() {
        this.form.info = undefined;
      },
    },
  };
</script>
