<template>
  <div class="page-container">
    <a-button class="mr10" type="primary" @click="downCcpDataTemplate">重推数据模板下载</a-button>
    <a-upload
      :custom-request="httpRequest"
      :file-list="fileList"
      :remove="handleRemove"
      accept=".xlsx"
      @change="handleChange"
    >
      <a-button type="primary"> <a-icon type="upload" /> 数据文件上传重推 </a-button>
    </a-upload>
    <a-icon class="info-icon" type="info-circle" />
    <span class="text">请先下载重推数据模版，按文件格式要求编辑文件后上传进行重推</span>
  </div>
</template>

<script>
  import { uploadCcpData } from '@/api/dataDetails';
  import { downloadFileByURL } from '@/utils';

  export default {
    name: 'Index',
    data() {
      return {
        fileList: [],
      };
    },
    methods: {
      downCcpDataTemplate() {
        const url = `${location.origin}/push_engine/pushRecord/downCcpDataTemplate`;
        downloadFileByURL(url, 'EntId.xlsx');
      },
      async httpRequest(options) {
        const formData = new FormData();
        formData.append('file', options.file);
        try {
          const { status, msg } = await uploadCcpData(formData);
          if (status !== 0) {
            options.onError(new Error(msg));
            this.$message.error(msg);
          } else {
            options.onSuccess('', options.file);
          }
        } catch (error) {
          options.onError(new Error('脚本上传失败'));
        }
      },
      handleRemove(file) {
        this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
      },
      handleChange({ _, fileList }) {
        console.log(fileList);
        this.fileList = fileList;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .page-container {
    display: flex;

    .info-icon {
      margin-top: 5px;
      margin-left: 5px;
      font-size: 18px;
    }

    .text {
      margin-top: 4px;
      margin-left: 5px;
      color: red;
      font-size: 12px;
    }
  }
</style>
