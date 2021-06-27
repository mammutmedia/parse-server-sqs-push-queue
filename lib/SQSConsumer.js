const events = require('events');
// eslint-disable-next-line import/no-unresolved
const { logger } = require('parse-server');
const { Consumer } = require('sqs-consumer');

class SQSConsumer extends events.EventEmitter {
  constructor(config) {
    super();
    if (!config.queueUrl) {
      throw new Error('SQS | No "queueUrl" specified!');
    }
    this.config = config;
  }

  subscribe(channel) {
    this.unsubscribe(channel);

    const handleMessage = (message) => {
      logger.debug('SQS | Recieved message');
      this.emit('message', channel, message.Body);
      Promise.resolve();
    };

    this.emitter = Consumer.create({
      queueUrl: this.config.queueUrl,
      sqs: this.config.sqs,
      batchSize: 10,
      handleMessage,
    });

    this.emitter.on('response_processed', () => {
      logger.debug('SQS | Message processed');
    });

    this.emitter.on('empty', () => {
      logger.debug('SQS | Queue is empty');
    });

    this.emitter.on('error', (err) => {
      logger.error(err.message);
    });

    this.emitter.on('processing_error', (err) => {
      logger.error(err.message);
    });

    this.subscriptions.set(channel, handleMessage);
    this.emitter.start();
  }

  unsubscribe(channel) {
    if (this.emitter) {
      this.emitter.stop();
    }

    if (!this.subscriptions.has(channel)) {
      logger.debug('SQS | Cannot unsubscribe from channel');
      return;
    }
    logger.debug('SQS | Unsubscribed from channel ', channel);
    if (this.emitter) {
      this.emitter.removeListener(channel, this.subscriptions.get(channel));
    }
    this.subscriptions.delete(channel);
  }
}

SQSConsumer.prototype.subscriptions = new Map();

module.exports.SQSConsumer = SQSConsumer;
