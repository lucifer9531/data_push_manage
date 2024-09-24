<template>
  <a-modal
    :bodyStyle="bodyStyle"
    :centered="true"
    :class="{ 'max-screen': isMax, 'min-screen': isMin }"
    :closable="false"
    :confirm-loading="confirmLoading"
    :destroyOnClose="destroyOnClose"
    :footer="footer"
    :maskClosable="false"
    :visible="visible"
    :width="width"
    class="my-modal"
    @cancel="cancelFun"
    @ok="okFun"
  >
    <div slot="title" class="modal-top flex_between">
      <div class="modal-title">{{ title }}</div>
      <div class="modal-btns">
        <a-icon
          v-if="showFullScreen"
          :title="isMin ? '恢复默认' : '最小化'"
          :type="isMin ? 'switcher' : 'minus'"
          style="margin-right: 10px"
          @click="setMinScreen"
        />
        <a-icon
          v-if="showFullScreen"
          :title="isMax ? '取消全屏' : '全屏'"
          :type="isMax ? 'fullscreen-exit' : 'fullscreen'"
          style="margin-right: 10px"
          @click="setMaxScreen"
        />
        <a-icon type="close" @click="cancelFun" />
      </div>
    </div>
    <slot></slot>
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
  </a-modal>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: '标题',
      },
      showFullScreen: {
        type: Boolean,
        default: false,
      },
      visible: {
        type: Boolean,
        default: false,
      },
      destroyOnClose: {
        type: Boolean,
        default: false,
      },
      footer: {
        type: [String, HTMLSlotElement],
      },
      width: {
        type: [Number, String],
        default: 600,
      },
      bodyStyle: {
        type: Object,
        default: null,
      },
      confirmLoading: {
        type: Boolean,
        default: false,
      },
      max: {
        type: Boolean,
        default: false,
      },
      min: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isMax: this.max,
        isMin: this.min,
      };
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          this.isMax = this.max;
          this.isMin = this.min;
        }
      },
    },
    methods: {
      setMaxScreen() {
        this.isMax = !this.isMax;
        if (this.isMax) this.isMin = false;
        this.$emit('update:max', this.isMax);
      },
      setMinScreen() {
        this.isMin = !this.isMin;
        if (this.isMin) this.isMax = false;
        this.$emit('update:min', this.isMin);
      },
      okFun() {
        this.$emit('ok');
      },
      cancelFun() {
        this.$emit('cancel');
      },
    },
  };
</script>
