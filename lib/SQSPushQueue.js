const { SQSPublisher } = require('./SQSPublisher');
const { SQSConsumer } = require('./SQSConsumer');

function createPublisher(config) {
  return new SQSPublisher(config);
}

function createSubscriber(config) {
  return new SQSConsumer(config);
}

const SQSPushQueue = {
  createPublisher,
  createSubscriber,
};

module.exports = {
  SQSPushQueue,
};
