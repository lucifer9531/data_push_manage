<template>
  <div class="json-editor">
    <textarea ref="textarea"></textarea>
  </div>
</template>

<script>
  import CodeMirror from 'codemirror';
  import 'codemirror/lib/codemirror.css';
  import 'codemirror/theme/idea.css';
  import 'codemirror/mode/javascript/javascript';

  export default {
    props: {
      value: {
        type: String,
        required: true,
      },
      height: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        editor: false,
      };
    },
    watch: {
      value: {
        handler(val) {
          const editorValue = this.editor.getValue();
          if (val !== editorValue) {
            this.editor.setValue(JSON.stringify(JSON.parse(val), null, 2));
          }
        },
        deep: true,
      },
      height() {
        this.editor.setSize('auto', this.height);
      },
    },
    mounted() {
      this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
        mode: {
          name: 'javascript',
          json: true,
        },
        lineNumbers: true,
        autofocus: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        lint: true,
        lineWrapping: true,
        tabSize: 2,
        cursorHeight: 0.9,
        theme: 'idea',
      });
      this.editor.setSize('auto', this.height);
      this.value && this.editor.setValue(JSON.stringify(JSON.parse(this.value), null, 2));
    },
  };
</script>

<style scoped>
  .json-editor {
    height: 100%;
    margin-bottom: 10px;
  }

  .json-editor >>> .CodeMirror {
    background-color: #f5f5f5;
    font-size: 14px;
    font-weight: normal;
  }

  .json-editor >>> .cm-s-rubyblue span.cm-string {
    color: #f08047;
  }
</style>
