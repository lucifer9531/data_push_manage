<template>
  <div ref="editor" style="border: 1px solid #ccc">
    <Toolbar
      :default-config="toolbarConfig"
      :editor="editor"
      :mode="editMode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="editValue"
      :default-config="editorConfig"
      :mode="editMode"
      :style="{ height: editorHeight + 'px', 'overflow-y': 'hidden' }"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
  import { Toolbar, Editor } from '@wangeditor/editor-for-vue';
  import { fileUpload } from '@/api/upload';
  import { IMAGE_URL_PREFIX } from '@/enums/setting';

  export default {
    name: 'WangEditor',
    components: { Toolbar, Editor },
    props: {
      value: {
        type: String,
        required: false,
        default: '',
      },
      editorHeight: {
        type: Number,
        required: false,
        default: 420,
      },
    },
    data() {
      return {
        toolbarConfig: {
          excludeKeys: ['fullScreen', 'codeBlock'],
        },
        editorConfig: {
          placeholder: '请输入内容...',
          MENU_CONF: {
            uploadImage: {
              allowedFileTypes: ['image/*'],
              async customUpload(file, insertFn) {
                const formData = new FormData();
                formData.append('file', file);
                const {
                  data: { filePath },
                } = await fileUpload(formData);
                const url = `${IMAGE_URL_PREFIX}${filePath}`;
                insertFn(url, '', '');
              },
            },
          },
        },
        editMode: 'simple',
        editor: null,
        editValue: null,
      };
    },
    watch: {
      editValue(newVal) {
        this.$emit('input', newVal);
      },
    },
    methods: {
      onCreated(editor) {
        this.editor = Object.seal(editor);
        this.editValue = this.value;
      },
    },
  };
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
  .text {
    text-align: left;
  }

  ::v-deep .w-e-text-container {
    height: 420px !important;
  }
</style>
