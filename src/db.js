const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: 'https://dynamodb.eu-central-1.amazonaws.com',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_DEFAULT_REGION,
});

const log = require('lambda-log');
const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'rates';


exports.put = (currency) => {
    const params = {
        TableName: table,
        Item: currency,
    };

    log.info(`Adding a new item... ${JSON.stringify(params)}`);
    return docClient.put(params).promise();
};

exports.get = (currency) => {
    const params = {
        TableName: table,
        Key: currency,
    };

    log.info('Getting an item...');
    return docClient.get(params).promise();
};
