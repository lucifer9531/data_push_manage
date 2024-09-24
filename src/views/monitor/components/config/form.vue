<template>
  <div>
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
        <a-form-model-item label="告警标题" prop="name">
          <a-input v-model.trim="form.name" placeholder="请输入告警标题" @change="checkName" />
        </a-form-model-item>
        <a-form-model-item label="告警描述">
          <a-textarea
            v-model="form.info"
            :auto-size="{ minRows: 2 }"
            placeholder="请输入告警描述"
          />
        </a-form-model-item>
        <a-form-model-item label="告警级别" prop="level">
          <a-select v-model="form.level" placeholder="请选择告警级别">
            <a-select-option v-for="item in levelEnum()" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="通知方式">
          <a-checkbox-group v-model="form.alertTypeArr" :options="alertTypeOptions" />
        </a-form-model-item>
        <a-form-model-item label="通知间隔(min)" prop="noticeInterval">
          <a-input-number
            v-model="form.noticeInterval"
            :min="0"
            placeholder="请输入通知间隔"
            style="width: 100%"
          />
        </a-form-model-item>
        <a-form-model-item label="是否生效">
          <a-switch v-model="form.enable" checked-children="启用" un-checked-children="禁用" />
        </a-form-model-item>
        <a-form-model-item label="通知人员">
          <a-icon
            class="icon-add"
            style="font-size: 20px"
            type="plus-circle"
            @click="openNoticeUserModal"
          />
          <a-table
            v-if="userList.length > 0"
            ref="table"
            :columns="columns"
            :data-source="userList"
            :pagination="false"
            :row-key="(row) => row.userId"
            size="small"
            style="width: 100%"
          >
            <template slot="operation" slot-scope="scope">
              <a class="grey" @click="deleteUser(scope)">
                <a-icon type="delete" />
              </a>
            </template>
          </a-table>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button @click="crud.cancelCU">取消</a-button>
        <a-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">
          确定
        </a-button>
      </template>
      <select-user ref="selectUser" :user-list="userList" @noticeUser="addNoticeUser($event)" />
    </luc-modal>
  </div>
</template>

<script>
  import LucModal from '@/components/Modal';
  import SelectUser from './selectUser.vue';
  import CRUD, { form } from '@crud/crud';
  import { levelEnum } from '../data';
  import _ from 'lodash';
  import { checkAlertName, getPushAlertById } from '@/api/monitor';

  const defaultForm = {
    name: '',
    info: '',
    level: '1',
    alertTypeArr: [],
    noticeInterval: 60,
    enable: true,
    noticeId: null,
    noticeName: '',
    questionId: '',
    questionName: '',
  };
  export default {
    components: { LucModal, SelectUser },
    mixins: [form(defaultForm)],
    data() {
      return {
        userList: [],
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
        isExistName: false,
        columns: Object.freeze([
          { title: '姓名', dataIndex: 'name', ellipsis: true, width: 90 },
          {
            title: '手机号',
            dataIndex: 'phone',
            width: 120,
            ellipsis: true,
          },
          {
            title: '邮箱',
            dataIndex: 'mailBox',
            ellipsis: true,
          },
          {
            title: '操作',
            width: 60,
            scopedSlots: { customRender: 'operation' },
            fixed: 'right',
          },
        ]),
        alertTypeOptions: Object.freeze([
          { label: '短信', value: '1' },
          { label: '邮件', value: '2' },
          { label: '电话', value: '3' },
        ]),
        rules: {
          name: [{ required: true, validator: this.validateAlertName, trigger: 'blur' }],
          level: [{ required: true, message: '请选择告警级别', trigger: 'change' }],
        },
      };
    },
    methods: {
      levelEnum() {
        return levelEnum;
      },
      addNoticeUser(data) {
        this.userList.push(data);
      },
      openNoticeUserModal() {
        this.$refs.selectUser.visible = true;
      },
      deleteUser(data) {
        this.userList = this.userList.filter((item) => item.userId !== data.userId);
      },
      checkName: _.debounce(async function () {
        const { status } = await checkAlertName({ name: this.form.name });
        this.isExistName = status === 0;
      }, 300),
      validateAlertName(rule, value, callback) {
        if (!value) {
          callback(new Error('告警名称不能为空'));
        } else if (this.crud.status.add > 0 && !this.isExistName) {
          callback(new Error('告警名称已存在'));
        } else {
          callback();
        }
      },
      async getPushAlertById(alertId) {
        const {
          data: { pushAlertOne, pushAlertRelUserOne },
        } = await getPushAlertById({ alertId });
        this.form.alertTypeArr = pushAlertOne.alertType.split(',');
        this.form.enable = pushAlertOne.enableFlag === '1';
        this.form.info = pushAlertOne.info;
        this.userList = pushAlertRelUserOne;
      },
      [CRUD.HOOK.beforeSubmit]() {
        this.form.enableFlag = this.form.enable ? '1' : '0';
        this.form.alertType = this.form.alertTypeArr.join(',');
        const userIds = this.userList.map((item) => item.userId).join(',');
        const userNames = this.userList.map((item) => item.name).join(',');
        this.form.noticeId = userIds;
        this.form.noticeName = userNames;
      },
      [CRUD.HOOK.beforeToAdd]() {
        for (const _key in this.form) {
          !Object.hasOwnProperty.call(defaultForm, _key) && delete this.form[_key];
        }
        this.userList = [];
      },
      [CRUD.HOOK.beforeToEdit]() {
        console.log(this.form);
        this.getPushAlertById(this.form.alertId);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .icon-add {
    color: green;
    font-size: 16px;
    cursor: pointer;
  }
</style>
