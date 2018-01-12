const net = require('./net');
const db = require('./db');
const Telegraf = require('telegraf');
const log = require('lambda-log');
const currencies = [
    'BTC', 'XRP', 'ETH', 'EOS', 'KRB', 'IOT', 'LTC', 'UAH', 'ZEC',
];

const prepareResponse = function(data, to) {
    const raw = {};
    const str = currencies.map((c) => {
        raw[c] = parseFloat(data.RAW[c][to].PRICE);
        return `1 ${c} *${parseFloat(data.RAW[c][to].PRICE).toFixed(3)} ${to}*`;
    });
    const content = `
${str.join('\n')}
`;
    return {content, raw};
};


export const getRate = async (message, db) => {
    const to = message.text.toUpperCase();
    let data = await net.getExchangeRates(to, currencies);
    data = JSON.parse(data);
    const prepared = prepareResponse(data, to);

    const id = `${message.from.id.toString()}-${message.text}`;
    const items = await db.get({
        id,
    });
    const savedItem = items.Item;
    log.info(savedItem);
    db.put({
        id,
        currencies: prepared.raw,
        currency: message.text,
    });
    if (savedItem && savedItem.currencies) {
        const items = Object.keys(savedItem.currencies).map((from) => {
            if (!data.RAW[from]) return;
            const val = parseFloat(data.RAW[from][to].PRICE);
            const change = (100 / savedItem.currencies[to]) * val;
            return `1 ${from} is ${val.toFixed(3)} ${to} (${(change-100).toFixed()}%)`;
        });
        log.info('reply');
        log.info(items);
        return items.join('\n');
    } else {
        return prepared.content;
    }
};


export class Controller {
    constructor(bot, log, net, db) {
        this.log = log;
        this.bot = bot;
        this.net = net;
        this.db = db;

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
                this.log.info('inside bindRate');

                if (ctx.message.text) {
                    return ctx.reply(await getRate(ctx.message, this.db));
                } else {
                    return ctx.reply('do not know this currency');
                }
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

            let data = await this.net.getExchangeRates(to, currencies);
            data = JSON.parse(data);
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


export const handle = (token, body) => {
    const bot = new Telegraf(token);
    db.init();

    (new Controller(bot, log, net, db)).handle(
        JSON.parse(body)
    );
};
