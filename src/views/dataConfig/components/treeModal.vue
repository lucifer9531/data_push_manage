<template>
  <luc-modal
    :centered="true"
    :maskClosable="false"
    :title="`${type}分类`"
    :visible="visible"
    :width="400"
    show-full-screen
    @cancel="visible = false"
    @ok="ok"
  >
    <a-form-model
      ref="form"
      :label-col="labelCol"
      :model="form"
      :rules="rules"
      :wrapper-col="wrapperCol"
      size="small"
    >
      <a-form-model-item label="分类名称" prop="name">
        <a-input v-model.trim="form.name" placeholder="请输入分类名称" @change="checkName" />
      </a-form-model-item>
    </a-form-model>
  </luc-modal>
</template>

<script>
  import lucModal from '@/components/Modal/index.vue';
  import _ from 'lodash';
  import { addSourceDataTree, checkInterfaceType, updateSourceDataTree } from '@/api/dataConfig';

  export default {
    name: 'TreeModal',
    components: { lucModal },
    data() {
      return {
        type: '新增',
        visible: false,
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        isExistName: false,
        currentNodeData: {},
        form: {
          name: '',
        },
        rules: {
          name: [{ required: true, validator: this.validateName, trigger: ['blur', 'change'] }],
        },
      };
    },
    methods: {
      validateName(rule, value, callback) {
        if (!value) {
          callback(new Error('分类名称不能为空'));
        } else if (!this.isExistName) {
          callback(new Error('分类名称已存在'));
        } else {
          callback();
        }
      },
      checkName: _.debounce(async function () {
        const { interfaceTypeId } = this.currentNodeData;
        const params =
          this.type === '编辑'
            ? { interfaceTypeId, title: this.form.name }
            : { title: this.form.name };
        const { status } = await checkInterfaceType(params);
        this.isExistName = status === 0;
      }, 300),
      resetForm() {
        this.form.name = '';
      },
      handleData(data) {
        const { name, edit } = data;
        this.visible = true;
        this.type = edit ? '编辑' : '新增';
        if (edit) this.form = Object.assign({}, { name });
        else this.resetForm();
        this.currentNodeData = data;
      },
      async doSubmit() {
        const { parentId, interfaceTypeId } = this.currentNodeData;
        const request = this.type === '新增' ? addSourceDataTree : updateSourceDataTree;
        const baseParams = {
          parentId: parentId === -1 ? '0' : this.type === '新增' ? interfaceTypeId : parentId,
          name: this.form.name,
        };
        const params = this.type === '新增' ? baseParams : { ...baseParams, interfaceTypeId };
        try {
          await request(params);
          await this.$parent.getTreeData();
          this.resetForm();
          this.visible = false;
        } catch (err) {
          throw new Error(err);
        }
      },
      ok() {
        this.$refs.form.validate((valid) => {
          if (!valid) return;
          this.doSubmit();
        });
      },
    },
  };
</script>
