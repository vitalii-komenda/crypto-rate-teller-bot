const AWS = require("aws-sdk");
const log = require('lambda-log');

AWS.config.update({
  region: "eu-central-1",
  endpoint: "http://localhost:8000",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "rates";

exports.put = (currency) => {
    const params = {
        TableName: table,
        Item: currency
    };

    log.info("Adding a new item...");
    docClient.put(params, function(err, data) {
        if (err) {
            log.error(`Unable to add item. Error JSON: ${JSON.stringify(err, null, 2)}`);
        } else {
            log.info(`Added item: ${JSON.stringify(data, null, 2)}`);
        }
    });
};


exports.get = (currency) => {
    const params = {
        TableName: table,
        Key: currency
    };

    log.info("Getting an item...");
    docClient.get(params, function(err, data) {
        if (err) {
            log.error(`Unable to get item. Error JSON: ${JSON.stringify(err, null, 2)}`);
        } else {
            log.info(`Got item: ${JSON.stringify(data, null, 2)}`);
        }
    });
};

// exports.get({
//     id: 'foo'
//     // foo: {a:1}
// });