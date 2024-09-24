const httpEnum = Object.freeze([
  { id: '1', name: 'Http' },
  { id: '2', name: 'activemq' },
  { id: '3', name: 'rabbitmq' },
  { id: '4', name: 'Kafka' },
  { id: '5', name: '微信公众号' },
  { id: '6', name: '邮件' },
]);

const methodEnum = Object.freeze([
  { id: '1', name: 'Post' },
  { id: '2', name: 'Get' },
]);

const dataCallingMethodEnum = Object.freeze([
  { id: '1', name: 'json' },
  { id: '2', name: 'map' },
]);

const queueTypeEnum = Object.freeze([
  { id: '1', name: 'queue' },
  { id: '2', name: 'topic' },
]);

const exchangeTypeEnum = Object.freeze([
  { id: '1', name: 'direct' },
  { id: '2', name: 'fanout' },
  { id: '3', name: 'topic' },
]);

export { httpEnum, methodEnum, dataCallingMethodEnum, queueTypeEnum, exchangeTypeEnum };
