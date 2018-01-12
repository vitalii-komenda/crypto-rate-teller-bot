require('dotenv').config();
const log = require('lambda-log');

module.exports.handle = (event, context, callback) => {
    let resp = 'Body is empty';
    if (event.body) {
        const controller = require('./src/controller');

        log.info('Started');
        log.info(event.body);

        controller.handle(process.env.TOKEN, event.body);

        log.info('Executed');
        resp = 'Crypto rules';
    }
    return callback(null, {
        statusCode: 200,
        body: resp,
    });
};
