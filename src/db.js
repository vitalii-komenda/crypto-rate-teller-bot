const AWS = require('aws-sdk');

const log = require('lambda-log');
const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'rates';

export const put = (currency) => {
    const params = {
        TableName: table,
        Item: currency,
    };

    log.info(`Adding a new item... ${JSON.stringify(params)}`);
    return docClient.put(params).promise();
};

export const get = (currency) => {
    const params = {
        TableName: table,
        Key: currency,
    };

    log.info('Getting an item...');
    return docClient.get(params).promise();
};

export const init = () => {
    AWS.config.update({
        endpoint: process.env.AWS_DYNAMO_ENDPOINT,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        region: process.env.AWS_DEFAULT_REGION,
    });
};
