const actions = require('./actions');
const Telegraf = require('telegraf');
const log = require('lambda-log');
const rate = require('./binds/rate');
const currencies = process.env.CURRENCIES.split(' ');

export const handle = (token, body) => {
    const bot = new Telegraf(token);

    require('./binds/hi').default(bot);
    require('./binds/help').default(bot);
    require('./binds/inline-query').default(
        bot,
        log,
        actions.exchangeRate,
        currencies
    );
    rate.default(
        bot,
        log,
        actions.exchangeRate,
        currencies
    );

    bot.handleUpdate(JSON.parse(body));
};
