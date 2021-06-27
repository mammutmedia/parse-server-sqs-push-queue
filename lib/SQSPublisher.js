// eslint-disable-next-line import/no-unresolved
const { logger } = require('parse-server');

class SQSPublisher {
  constructor(config) {
    if (!config.queueUrl) {
      throw new Error('SQS | No "queueUrl" specified!');
    }
    this.queueUrl = config.queueUrl;
    this.emitter = config.sqs;
  }

  publish(channel, messageStr) {
    let payload;
    if (Array.isArray(messageStr)) {
      payload = messageStr.map((body) => ({
        MessageBody: body,
        QueueUrl: this.config.queueUrl,
      }));
    } else {
      payload = {
        MessageBody: messageStr,
        QueueUrl: this.queueUrl,
      };
    }

    logger.debug(`Sending message to sqs with payload:  ${JSON.stringify(payload)}`);

    const sendSQSMessage = this.emitter.sendMessage(payload).promise();

    sendSQSMessage.then((data) => {
      logger.debug('SQS | Successfully sent message with id ', data.MessageId);
    }).catch((err) => {
      logger.error('SQS | ERROR: ', err.message);
    });
  }
}

module.exports.SQSPublisher = SQSPublisher;
