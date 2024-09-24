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
      style="height: 420px; overflow-y: auto"
    >
      <a-form-model-item label="接口编码" prop="interfaceId">
        <a-select
          v-model="form.interfaceId"
          placeholder="请选择接口类型"
          @change="handleInterfaceChange"
        >
          <a-select-option
            v-for="item in interfaceOptions"
            :key="item.interfaceId"
            :value="item.interfaceId"
          >
            {{ item.code }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="推送数据">
        <a-input v-model.trim="form.interfaceInfo" disabled />
      </a-form-model-item>
      <a-form-model-item label="处理脚本" prop="fileList">
        <a-upload
          :custom-request="httpRequest"
          :file-list="form.fileList"
          :remove="handleRemove"
          accept=".groovy"
          @change="handleChange"
          @preview="handlePreview"
        >
          <a-button> <a-icon type="upload" /> 源数据脚本上传 </a-button>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item label="目标地址" prop="targetId">
        <a-select v-model="form.targetId" placeholder="请选择目标地址">
          <a-select-option
            v-for="item in targetOptions"
            :key="item.targetId"
            :value="item.targetId"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="推送时间">
        <a-icon class="icon-add" style="font-size: 20px" type="plus-circle" @click="addTime" />
        <div v-for="(item, index) in timeData" :key="index" class="time-item">
          <range-picker-time :range="item" @returnBack="setTime($event, index)" />
          <a-icon class="icon-delete" type="minus-circle" @click="removeTime(index)" />
        </div>
      </a-form-model-item>
      <a-form-model-item label="失败重推(次)" prop="pushAgainCount">
        <a-input-number
          v-model="form.pushAgainCount"
          :min="0"
          placeholder="请输入失败重推次数"
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
  import LucModal from '@/components/Modal';
  import RangePickerTime from '@/components/RangePickerTime';
  import CRUD, { form } from '@crud/crud';
  import { uploadScript } from '@/api/data';
  import { getInterfaceData, getTargetData } from '@/api/strategyConfig';
  const defaultForm = {
    strategyId: null,
    interfaceId: '',
    targetId: '',
    scriptId: '',
    sendTime: '',
    fileList: [],
    pushAgainCount: 0,
    interfaceCodes: '',
    interfaceInfo: '',
  };
  export default {
    components: { LucModal, RangePickerTime },
    mixins: [form(defaultForm)],
    data() {
      return {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
        interfaceOptions: [],
        targetOptions: [],
        timeData: [],
        rules: {
          interfaceId: [{ required: true, message: '请选择接口', trigger: 'change' }],
          targetId: [{ required: true, message: '请选择目标地址', trigger: 'change' }],
          fileList: [{ required: true, message: '请上传脚本文件', trigger: 'change' }],
          pushAgainCount: [{ required: true, message: '请输入失败重推次数', trigger: 'blur' }],
        },
      };
    },
    mounted() {
      this.getInterfaceData();
      this.getTargetData();
    },
    methods: {
      async httpRequest(options) {
        const formData = new FormData();
        formData.append('file', options.file);
        try {
          const {
            data: { scriptId },
          } = await uploadScript(formData);
          this.form.scriptId = scriptId || '';
          const fileWithNewName = {
            ...options.file,
            name: `PushTemplate_${scriptId}.groovy`,
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
      async getInterfaceData() {
        const { data } = await getInterfaceData();
        this.interfaceOptions = data;
      },
      async getTargetData() {
        const { data } = await getTargetData();
        this.targetOptions = data;
      },
      handleInterfaceChange(val) {
        this.form.interfaceInfo =
          this.interfaceOptions.find((item) => item.interfaceId === val)?.info || '';
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
      async handlePreview() {
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
      addTime() {
        this.timeData.push(['', '']);
      },
      removeTime(index) {
        this.timeData.splice(index, 1);
      },
      setTime(val, idx) {
        this.$set(this.timeData, idx, val);
      },
      [CRUD.HOOK.beforeSubmit]() {
        const allowedFields = [
          'interfaceId',
          'targetId',
          'scriptId',
          'sendTime',
          'pushAgainCount',
          'interfaceCodes',
          'oldScriptId',
          'strategyId',
        ];
        const result = [];
        this.timeData.forEach((item) => {
          result.push({ startTime: item[0], sendTime: item[1] });
        });
        this.form.sendTime = JSON.stringify(result);
        this.form.interfaceCodes =
          this.interfaceOptions.find((item) => item.interfaceId === this.form.interfaceId)?.code ||
          '';
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
        this.form.interfaceId = this.interfaceOptions[0]?.interfaceId || '';
        this.form.interfaceInfo = this.interfaceOptions[0]?.info || '';
        this.form.targetId = this.targetOptions[0]?.targetId || '';
      },
      [CRUD.HOOK.beforeToEdit]() {
        this.timeData = [];
        this.form.fileList = [];
        const data = JSON.parse(this.form.sendTime) || [];
        data?.forEach((item) => {
          this.timeData.push([item.startTime, item.endTime]);
        });
        this.form.fileList.push({
          uid: '-1',
          name: `PushTemplate_${this.form.scriptId}.groovy`,
          status: 'done',
        });
        this.form.oldScriptId = this.form.scriptId;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .time-item {
    display: flex;
    align-items: center;
  }

  .icon-add,
  .icon-delete {
    margin-left: 10px;
    font-size: 16px;
    cursor: pointer;
  }

  .icon-delete {
    color: red;
  }

  .icon-add {
    color: green;
  }
</style>
