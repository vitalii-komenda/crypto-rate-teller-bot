module.exports.handle = (event, context, callback) => {
    if (event.body) {
        const log = require('lambda-log');
        const bot = require('./src/bot');
        log.info('Started');
        log.info(event.body);

        bot.start(process.env.TOKEN, event.body);

        log.info('Executed')
        return callback(null, {
            statusCode: 200,
            body: 'crypto rules',
        });
    }
};