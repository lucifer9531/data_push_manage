<template>
  <luc-modal
    :centered="true"
    :maskClosable="false"
    :title="crud.status.title"
    :visible="crud.status.cu > 0"
    :width="600"
    show-full-screen
    @cancel="crud.cancelCU"
  >
    <a-form-model
      ref="form"
      :label-col="labelCol"
      :model="form"
      :rules="rules"
      :wrapper-col="wrapperCol"
      size="small"
      style="height: 480px; overflow-y: auto"
    >
      <a-form-model-item label="目标名称" prop="name">
        <a-input v-model.trim="form.name" placeholder="请输入目标名称" @change="checkTargetName" />
      </a-form-model-item>
      <a-form-model-item label="接口类型" prop="type">
        <a-select v-model="form.type" placeholder="请选择接口类型" @change="handleTypeChange">
          <a-select-option v-for="item in httpEnum()" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '2'" label="队列名称" prop="queueName">
        <a-input v-model.trim="form.queueName" placeholder="请输入队列名称" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '2'" label="队列类型" prop="queueType">
        <a-select v-model="form.queueType" placeholder="请选择队列类型">
          <a-select-option v-for="item in queueTypeEnum()" :key="item.id" :value="item.name">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '3'" label="交换机名称" prop="exchangeName">
        <a-input v-model.trim="form.exchangeName" placeholder="请输入交换机名称" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '3'" label="交换机类型" prop="exchangeType">
        <a-select v-model="form.exchangeType" placeholder="请选择交换机类型">
          <a-select-option v-for="item in exchangeTypeEnum()" :key="item.id" :value="item.name">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '3'" label="路由键" prop="routingKey">
        <a-input v-model.trim="form.routingKey" placeholder="请输入路由键" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '4'" label="bootstrap.servers" prop="server">
        <a-input v-model.trim="form.server" placeholder="多个server用,隔开" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '4'" label="topic" prop="topic">
        <a-input v-model.trim="form.topic" placeholder="请输入topic" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '4'" label="acks">
        <a-input-number v-model="form.acks" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '4'" label="retries">
        <a-input-number v-model="form.retries" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '4'" label="batch.size">
        <a-input v-model.trim="form.size" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '4'" label="linger.ms">
        <a-input-number v-model="form.ms" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '4'" label="buffer.memory">
        <a-input v-model.trim="form.memory" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '4'" label="key.serializer">
        <a-input v-model.trim="form.kserializer" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '4'" label="value.serializer">
        <a-input v-model.trim="form.vserializer" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '6'" label="邮箱地址" prop="emails">
        <a-input v-model.trim="form.emails" placeholder="请输入邮箱地址，多个用,隔开" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '6'" label="邮件主题" prop="subject">
        <a-input v-model.trim="form.subject" placeholder="请输入邮件主题" />
      </a-form-model-item>
      <a-form-model-item
        v-if="!['4', '6'].includes(form.type)"
        :label="['1', '5'].includes(form.type) ? 'URL' : 'IP地址'"
        :rules="dynamicRules"
        prop="url"
      >
        <a-input
          v-model.trim="form.url"
          :placeholder="
            ['1', '5'].includes(form.type)
              ? '请输入URL(如：http://ip:port/xxx/xxx)'
              : '请输入IP地址'
          "
        />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '2'" label="用户名" prop="username">
        <a-input v-model.trim="form.username" placeholder="请输入用户名" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '2'" label="密码">
        <a-input v-model.trim="form.password" placeholder="请输入密码" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '1'" label="请求方式" prop="method">
        <a-select v-model="form.method" placeholder="请选择接口类型">
          <a-select-option v-for="item in methodEnum()" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item v-if="form.type === '1'" label="数据调用方式" prop="dataCallingMethod">
        <a-select v-model="form.requestDataType" placeholder="请选择接口类型">
          <a-select-option
            v-for="item in dataCallingMethodEnum()"
            :key="item.id"
            :value="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="返回样例">
        <a-textarea
          v-model="form.resultText"
          :auto-size="{ minRows: 2 }"
          placeholder="请输入返回样例"
        />
      </a-form-model-item>
      <a-form-model-item label="返回判断" prop="fileList">
        <a-upload
          :custom-request="httpRequest"
          :file-list="form.fileList"
          :remove="handleRemove"
          accept=".groovy"
          @change="handleChange"
          @preview="handlePreview"
        >
          <a-button> <a-icon type="upload" /> 脚本上传 </a-button>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item label="调用间隔(ms)" prop="callInterval">
        <a-input-number
          v-model="form.callInterval"
          :min="0"
          placeholder="请输入调用间隔"
          style="width: 100%"
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
  import lucModal from '@/components/Modal';
  import CRUD, { form } from '@crud/crud';
  import _ from 'lodash';
  import { checkTargetName } from '@/api/targetConfig';
  import { uploadScript } from '@/api/data';
  import { isIP, isUrl } from '@/utils/validate';
  import {
    dataCallingMethodEnum,
    exchangeTypeEnum,
    httpEnum,
    methodEnum,
    queueTypeEnum,
  } from '@/views/targetConfig/data';
  const defaultForm = {
    targetId: null,
    type: '1',
    name: '',
    url: '',
    method: '1',
    requestDataType: 'json',
    resultText: '',
    scriptId: '',
    oldScriptId: '',
    fileList: [],
    callInterval: 0,
    connConfig: '',
    queueName: '',
    queueType: 'queue',
    username: '',
    password: '',
    exchangeName: '',
    exchangeType: 'direct',
    routingKey: '',
    server: '',
    topic: '',
    acks: 1,
    retries: 3,
    size: '16KB',
    ms: 0,
    memory: '32MB',
    kserializer: 'org.apache.kafka.common.serialization.StringSerializer',
    vserializer: 'org.apache.kafka.common.serialization.StringSerializer',
    emails: '',
    subject: '',
  };
  export default {
    components: { lucModal },
    mixins: [form(defaultForm)],
    data() {
      return {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        isExistTargetName: false,
        urlRules: [{ required: true, validator: this.validateUrl, trigger: ['blur', 'change'] }],
        ipRules: [{ required: true, validator: this.validateIP, trigger: ['blur', 'change'] }],
        rules: {
          type: [{ required: true, message: '请选择接口类型', trigger: 'change' }],
          name: [{ required: true, validator: this.validateTargetName, trigger: 'blur' }],
          method: [{ required: true, message: '请选择请求方式', trigger: 'change' }],
          requestDataType: [{ required: true, message: '请选择数据调用方式', trigger: 'change' }],
          fileList: [{ required: true, message: '请上传脚本文件', trigger: 'change' }],
          callInterval: [{ required: true, message: '请输入调用间隔', trigger: 'blur' }],
          queueName: [{ required: true, message: '请输入队列名称', trigger: 'blur' }],
          queueType: [{ required: true, message: '请选择队列类型', trigger: 'change' }],
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          exchangeName: [{ required: true, message: '请输入交换机名称', trigger: 'blur' }],
          exchangeType: [{ required: true, message: '请选择交换机类型', trigger: 'change' }],
          routingKey: [{ required: true, message: '请输入路由键', trigger: 'blur' }],
          server: [{ required: true, message: '请输入bootstrap.servers', trigger: 'blur' }],
          topic: [{ required: true, message: '请输入topic', trigger: 'blur' }],
          emails: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }],
          subject: [{ required: true, message: '请输入邮件主题', trigger: 'blur' }],
        },
      };
    },
    computed: {
      dynamicRules() {
        return ['1', '5'].includes(this.form.type) ? this.urlRules : this.ipRules;
      },
    },
    methods: {
      dataCallingMethodEnum() {
        return dataCallingMethodEnum;
      },
      methodEnum() {
        return methodEnum;
      },
      exchangeTypeEnum() {
        return exchangeTypeEnum;
      },
      queueTypeEnum() {
        return queueTypeEnum;
      },
      httpEnum() {
        return httpEnum;
      },
      async httpRequest(options) {
        this.form.fileList = [];
        const formData = new FormData();
        formData.append('file', options.file);
        try {
          const {
            data: { scriptId },
          } = await uploadScript(formData);
          this.form.scriptId = scriptId || '';
          const fileWithNewName = {
            ...options.file,
            name: `ResultTemplate_${scriptId}.groovy`,
          };
          options.onSuccess(scriptId, fileWithNewName);
          this.form.fileList = this.form.fileList.map((file) => {
            if (file.uid === options.file.uid) {
              return {
                ...file,
                name: fileWithNewName.name,
              };
            }
            return file;
          });
        } catch (error) {
          options.onError(new Error('脚本上传失败'));
        }
      },
      handleChange({ _, fileList }) {
        if (fileList.length > 1) {
          fileList = [fileList[fileList.length - 1]];
        }
        this.form.fileList = fileList;
      },
      handleRemove(file) {
        this.form.scriptId = '';
        this.form.fileList = this.form.fileList.filter((item) => item.uid !== file.uid);
      },
      handlePreview() {
        if (!this.form.scriptId) return;
        const url = `${location.origin}/push_engine/pushTarget/downScript`;
        const form = document.createElement('form');
        form.method = 'post';
        form.action = url;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'scriptId';
        input.value = this.form.scriptId;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      handleTypeChange() {
        this.$refs.form.clearValidate();
      },
      checkTargetName: _.debounce(async function () {
        const { status } = await checkTargetName({ interfaceName: this.form.name });
        this.isExistTargetName = status === 0;
      }, 300),
      validateUrl(rule, value, callback) {
        if (!value) {
          callback(new Error('URL不能为空'));
        } else if (!isUrl(value)) {
          callback(new Error('请输入合法的URL'));
        } else {
          callback();
        }
      },
      validateIP(rule, value, callback) {
        if (!value) {
          callback(new Error('IP不能为空'));
        } else if (!isIP(value)) {
          callback(new Error('请输入合法的IP'));
        } else {
          callback();
        }
      },
      validateTargetName(rule, value, callback) {
        if (!value) {
          callback(new Error('目标名称不能为空'));
        } else if (this.crud.status.add > 0 && !this.isExistTargetName) {
          callback(new Error('目标名称已存在'));
        } else {
          callback();
        }
      },
      generateConnConfig(fields, form) {
        return fields.reduce((acc, field) => {
          acc[field] = form[field];
          return acc;
        }, {});
      },
      handleHttpData() {
        const connConfigFields = ['url', 'method', 'requestDataType'];
        this.form.connConfig = JSON.stringify(this.generateConnConfig(connConfigFields, this.form));
      },
      handleActivemqData() {
        const connConfigFields = ['url', 'username', 'password', 'queueName', 'queueType'];
        this.form.connConfig = JSON.stringify(this.generateConnConfig(connConfigFields, this.form));
      },
      handleRabbitmqData() {
        const connConfigFields = [
          'url',
          'username',
          'password',
          'exchangeName',
          'exchangeType',
          'routingKey',
        ];
        this.form.connConfig = JSON.stringify(this.generateConnConfig(connConfigFields, this.form));
      },
      handleKafkaData() {
        const connConfigFields = [
          'server',
          'topic',
          'acks',
          'retries',
          'size',
          'ms',
          'memory',
          'kserializer',
          'vserializer',
        ];
        this.form.connConfig = JSON.stringify(this.generateConnConfig(connConfigFields, this.form));
      },
      handleWechatData() {
        const connConfigFields = ['url'];
        this.form.connConfig = JSON.stringify(this.generateConnConfig(connConfigFields, this.form));
      },
      handleEmailData() {
        const connConfigFields = ['emails', 'subject'];
        this.form.connConfig = JSON.stringify(this.generateConnConfig(connConfigFields, this.form));
      },
      handleFormData(type) {
        const connConfigHandlers = {
          1: this.handleHttpData,
          2: this.handleActivemqData,
          3: this.handleRabbitmqData,
          4: this.handleKafkaData,
          5: this.handleWechatData,
          6: this.handleEmailData,
        };
        connConfigHandlers[type]();
      },
      [CRUD.HOOK.beforeSubmit]() {
        this.handleFormData(this.form.type);
        const allowedFields = [
          'callInterval',
          'name',
          'resultText',
          'scriptId',
          'type',
          'oldScriptId',
          'targetId',
          'connConfig',
        ];
        const form = this.form;
        Object.keys(form).forEach((key) => {
          if (!allowedFields.includes(key)) {
            delete form[key];
          }
        });
        this.form = form;
      },
      [CRUD.HOOK.beforeToAdd]() {
        this.form = this.crud.form;
      },
      [CRUD.HOOK.beforeToEdit]() {
        this.form.fileList = [];
        const data = JSON.parse(this.form.connConfig) || '{}';
        for (const _key in data) {
          if (Object.prototype.hasOwnProperty.call(defaultForm, _key)) {
            this.form[_key] = data[_key];
          }
        }
        this.form.fileList.push({
          uid: '-1',
          name: `ResultTemplate_${this.form.scriptId}.groovy`,
          status: 'done',
        });
        this.form.oldScriptId = this.form.scriptId;
      },
    },
  };
</script>
