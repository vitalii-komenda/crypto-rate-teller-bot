const net = require('./net');
const db = require('./db');
const Telegraf = require('telegraf');
const log = require('lambda-log');
const currencies = ['BTC', 'XRP', 'ETH', 'EOS', 'KRB', 'IOT', 'LTC', 'UAH', 'ZEC', 'EUR', 'USD'];



const prepareResponse = function(data, to) {
    const raw = {};
    const str = currencies.map((c) => {
        raw[c] = parseFloat(data.RAW[c][to].PRICE);
        return `1 ${c} is *${parseFloat(data.RAW[c][to].PRICE).toFixed(3)} ${to}*`;
    });
    const content = `
${str.join('\n')}
`;
    return {content, raw};
};

function precisionRound(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

export const calcChange = (from, to) => {
    const res = (100 / precisionRound(to, 3)) * precisionRound(from, 3);

    if (isNaN(res)) {
        return 100;
    }
    return res;
};

export const getRate = async (message, db) => {
    const to = message.text.toUpperCase();
    let data = await net.getExchangeRates(to, currencies);
    data = JSON.parse(data);
    const prepared = prepareResponse(data, to);

    const id = `${message.chat.id.toString()}-${to}`;
    const items = await db.get({
        id,
    });
    const savedItem = items.Item;
    log.info(savedItem);
    db.put({
        id,
        currencies: prepared.raw,
        currency: to,
    });
    if (savedItem && savedItem.currencies) {
        const items = Object.keys(savedItem.currencies).map((from) => {
            if (!data.RAW[from] || from === to) return;
            const val = parseFloat(data.RAW[from][to].PRICE);
            const change = calcChange(savedItem.currencies[from], val);
            return `1 ${from} is *${val.toFixed(3)} ${to}* (${(100 - change).toFixed(1)}%)`;
        }).filter((v) => v);
        log.info('reply');
        log.info(items);
        return items.join('\n');
    } else {
        return prepared.content;
    }
};

export const handle = (token, body) => {
    const bot = new Telegraf(token);
    db.init();
    require('./binds/hi').default(bot);
    require('./binds/help').default(bot);
    require('./binds/rate').default(
        bot,
        log,
        db,
        currencies,
        getRate
    );
    require('./binds/inline-query').default(
        bot,
        log,
        db,
        getRate
    );
    bot.handleUpdate(JSON.parse(body));
};
