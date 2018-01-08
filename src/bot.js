const net = require('./net');
const db = require('./db');
require('dotenv').config();
const Telegraf = require('telegraf');
const log = require('lambda-log');
const token = process.env.TOKEN;
const currencies = ['BTC', 'XRP', 'ETH', 'EOS', 'KRB', 'IOT', 'LTC', 'UAH', 'ZEC'];

const prepareResponse = function (data, to) {
    data = JSON.parse(data);
    const str = currencies.map(c => (`1 ${c} *${parseFloat(data.RAW[c][to].PRICE).toFixed(3)} ${to}*`));
    const content = `
${str.join('\n')}
`;
    return content;
}


function init(token, body) {
    try {
        const bot = new Telegraf(token);
        bot.hears('hi', ctx => ctx.reply('Hey there!'));
//new RegExp(`^(${currencies.join('|')})$`, 'i')
        bot.hears('eur', async (ctx) => {
            // log.info('what');
            // log.info(ctx.message);

            // if (ctx.message.text) {
            //     const to = ctx.message.text.toUpperCase();
            //     const data = await net.getExchangeRates(to, currencies);
            //     const content = prepareResponse(data, to);

            //     db.put({id: ctx.message.from.id.toString(), currencies: content});

            //     return ctx.reply(content);
            // } else {
            //     return ctx.reply('do not know this currency');
            // }
        });

        bot.command('help', (ctx) => ctx.reply('Type currency name to see rates (for example EUR)'));

        bot.on('inline_query', async (ctx) => {
            const to = ctx.inlineQuery.query.toUpperCase();
            let content = 'Not found';
            if (to.length != 3) {
                return;
            }

            const data = await net.getExchangeRates(to, currencies);
            content = prepareResponse(data, to);
            const result = [{
                id: ctx.inlineQuery.query,
                type: 'article',
                cache_time: 0,
                title: `Show rate for ${to}`,
                /* eslint-disable camelcase */
                input_message_content: {
                    parse_mode: 'markdown',
                    message_text: content
                }
            }]
            ctx.answerInlineQuery(result);
        });
        const tmp = JSON.parse(body);
        bot.handleUpdate(tmp);
    } catch(error) {
        log.error(error);
    };
};



exports.start = (token, body) => {
    init(token, body);
};