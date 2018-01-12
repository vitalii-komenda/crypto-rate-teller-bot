const net = require('./net');
const db = require('./db');
const Telegraf = require('telegraf');
const log = require('lambda-log');
const currencies = [
    'BTC', 'XRP', 'ETH', 'EOS', 'KRB', 'IOT', 'LTC', 'UAH', 'ZEC',
];

const prepareResponse = function(data, to) {
    data = JSON.parse(data);
    const raw = {};
    const str = currencies.map((c) => {
        raw[c] = parseFloat(data.RAW[c][to].PRICE).toFixed(3);
        return `1 ${c} *${parseFloat(data.RAW[c][to].PRICE).toFixed(3)} ${to}*`;
    });
    const content = `
${str.join('\n')}
`;
    return {content, raw};
};

export const getRate = async (message) => {
    const to = message.text.toUpperCase();
    const data = await net.getExchangeRates(to, currencies);

    const items = await db.get({
        id: message.from.id.toString(),
    });
    const res = items.Item;
    log.info(res);
    db.put({
        id: message.from.id.toString(),
        currencies: data.raw,
        currency: message.text,
    });
    log.info(data.RAW);
    if (res.currencies) {
        const str = Object.keys(res.currencies).map((c) => {
            const val = 1;//parseFloat(data.RAW[c][to].PRICE).toFixed(3);
            log.info(c);
            log.info(to);
            const change = 100 / res.currencies[c] * val;
            return `1 ${c} ${val} ${to} (${change}%)`;
        });
        return ctx.reply(str.join('\n'));
    } else {
        return ctx.reply(prepareResponse(data, to).content);
    }
};

export class Controller {
    constructor(bot, log, net) {
        this.log = log;
        this.bot = bot;
        this.net = net;

        this.bindHi();
        this.bindRate();
        this.bindHelp();
        this.bindInlineQuery();
    }

    handle(body) {
        this.bot.handleUpdate(body);
    }


    bindHi() {
        this.bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
    }

    bindRate() {
        this.bot.hears(
            new RegExp(`^(${currencies.join('|')})$`, 'i'),
            async (ctx) => {
                try {
                    this.log.info('what');
                    this.log.info(ctx.message);

                    if (ctx.message.text) {
                        return ctx.reply(getRate(ctx.message));
                    } else {
                        return ctx.reply('do not know this currency');
                    }
                } catch (error) {
                    this.log.error(error);
                };
            }
        );
    }

    bindHelp() {
        this.bot.command(
            'help',
            (ctx) => ctx.reply('Type currency name to see rates (for example EUR)')
        );
    }

    bindInlineQuery() {
        this.bot.on('inline_query', async (ctx) => {
            const to = ctx.inlineQuery.query.toUpperCase();
            let content = 'Not found';
            if (to.length != 3) {
                return;
            }

            const data = await this.net.getExchangeRates(to, currencies);
            content = prepareResponse(data, to);
            const result = [{
                id: ctx.inlineQuery.query,
                type: 'article',
                cache_time: 0,
                title: `Show rate`,
                /* eslint-disable camelcase */
                input_message_content: {
                    parse_mode: 'markdown',
                    message_text: content.content,
                },
            }];
            ctx.answerInlineQuery(result);
        });
    }
};


export default handle = (token, body) => {
    const bot = new Telegraf(token);

    (new Controller(bot, log, net)).handle(
        JSON.parse(body)
    );
};
