const request = require('request');
require('dotenv').config();
const Telegraf = require('telegraf');
const log = require('lambda-log');
const token = process.env.TOKEN;
const currencies = ['BTC', 'XRP', 'ETH', 'EOS', 'KRB', 'IOT', 'LTC', 'UAH', 'ZEC'];

const getExchangeRates = function (to) {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${currencies.join(',')}&tsyms=${to}`;
    log.info(url);
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
};
const prepareResponse = function (data, to) {
    data = JSON.parse(data);
    log.info(data.RAW['BTC']['BTC'])
    const str = currencies.map(c => (`1 ${c} *${parseFloat(data.RAW[c][to].PRICE).toFixed(2)} ${to}*`));
    const content = `
${str.join('\n')}
`;
    return content;
}

function init(token, body) {
    const bot = new Telegraf(token);
    bot.hears('hi', ctx => ctx.reply('Hey there!'));

    bot.on('inline_query', async (ctx) => {
        const to = ctx.inlineQuery.query.toUpperCase();
        let content = 'Not found';
        if (to.length != 3) {
            return;
        }
        try {
            const data = await getExchangeRates(to);
            content = prepareResponse(data, to);
            const result = [{
                id: ctx.inlineQuery.query,
                type: 'article',
                cache_time: 0,
                title: `Show rate`,
                /* eslint-disable camelcase */
                input_message_content: {
                    parse_mode: 'markdown',
                    message_text: content
                }
            }]
            ctx.answerInlineQuery(result)
        } catch(error) {
            log.error(error);
        };
    });
    const tmp = JSON.parse(body);
    bot.handleUpdate(tmp);
};



exports.start = (token, body) => {
    log.info('started');
    init(token, body);
};