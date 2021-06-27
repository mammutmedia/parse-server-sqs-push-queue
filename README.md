# parse-server-sqs-push-queue

AWS SQS backed message queue. This adapter allows a work queue to be spread across a cluster of machines.

Inspired and partly rewritten based on the original project: [parse-server-sqs-mq-adapter](https://github.com/parse-community/parse-server-sqs-mq-adapter)

## Installation

`npm install --save parse-server-sqs-push-queue`

## Usage

```js
const ParseServer = require('parse-server').ParseServer;
const SQSPushQueue = require('parse-server-sqs-push-queue').SQSPushQueue;
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: '...',
  secretAccessKey: '...'
});

const parseServer = new ParseServer({
    ...
    push: {
        ...
        queueOptions: {
            messageQueueAdapter: SQSPushQueue,
            queueUrl: 'https://sqs.us-east-1.amazonaws.com/XXX/Parse-Queue',
            sqs: new AWS.SQS(),
        },
    },
});
```

See: [sqs-consumer](https://www.npmjs.com/package/sqs-consumer#options) for complete list of configuration options.

### Credentials

By default the consumer will look for AWS credentials in the places [specified by the AWS SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Setting_AWS_Credentials). The simplest option is to export your credentials as environment variables:

```bash
export AWS_SECRET_ACCESS_KEY=...
export AWS_ACCESS_KEY_ID=...
```
