<template>
  <luc-modal
    :centered="true"
    :footer="null"
    :maskClosable="false"
    :visible="visible"
    :width="600"
    show-full-screen
    title="告警明细"
    @cancel="visible = false"
  >
    <div class="content">
      <div class="header">
        <a-row v-for="(row, rowIndex) in rows" :key="rowIndex">
          <a-col v-for="(col, colIndex) in row" :key="colIndex" :span="12">
            {{ col.label }}：{{ col.value }}
          </a-col>
        </a-row>
      </div>
      <a-divider />
      <div class="footer">
        <span>告警内容：</span>
        <a-textarea v-model="alertContent" :auto-size="{ minRows: 2 }" disabled />
      </div>
    </div>
  </luc-modal>
</template>

<script>
  import LucModal from '@/components/Modal/index.vue';
  import { getPushAlertRecById } from '@/api/monitor';
  import moment from 'moment';
  import { alertTypeEnum, levelEnum, noticeResultEnum } from '@/views/monitor/components/data';

  export default {
    name: 'EDetails',
    components: { LucModal },
    data() {
      return {
        visible: false,
        alertContent: '',
        rows: [
          [
            { key: 'alertName', label: '告警标题', value: '' },
            { key: 'userName', label: '通知人员', value: '' },
          ],
          [
            { key: 'alertTime', label: '告警时间', value: '' },
            { key: 'phone', label: '手机号', value: '' },
          ],
          [
            { key: 'email', label: '邮箱', value: '' },
            { key: 'sendTime', label: '通知时间', value: '' },
          ],
          [
            { key: 'level', label: '告警级别', value: '' },
            { key: 'sendType', label: '告警方式', value: '' },
          ],
          [{ key: 'sendResult', label: '通知结果', value: '' }],
        ],
      };
    },
    methods: {
      async getPushAlertRecById(recId) {
        const { data } = await getPushAlertRecById({ recId });
        this.handleData(data);
      },
      handleData(data) {
        const keyProcessors = {
          alertTime: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
          sendTime: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
          level: (value) => levelEnum.find((item) => item.id === value)?.name || '--',
          sendType: (value) => alertTypeEnum.find((item) => item.id === value)?.name || '--',
          sendResult: (value) => noticeResultEnum.find((item) => item.id === value)?.name || '--',
        };
        this.rows.forEach((row) => {
          row.forEach((it) => {
            if (keyProcessors[it.key]) {
              data[it.key] = keyProcessors[it.key](data[it.key]);
            }
            if (Object.prototype.hasOwnProperty.call(data, it.key)) {
              it.value = data[it.key];
            }
          });
        });
        this.alertContent = data.alertContent;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    flex-direction: column;

    ::v-deep .ant-input-disabled {
      background: #fff;
      color: rgba(0, 0, 0, 65%);
    }
  }
</style>
