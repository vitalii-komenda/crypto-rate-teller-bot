const log = require('lambda-log');
const request = require('request');
const db = require('./db');
db.init();

const FIATS = ['EUR', 'USD', 'UAH'];
const isFiat = (currency) => {
    return FIATS.indexOf(currency.toUpperCase()) !== -1;
};

export const getExchangeRates = function(to, currencies) {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${currencies.join(',')}&tsyms=${to}`;
    log.info(url);
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, body) {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
};

export const saveExchangeRates = async (
    id, currencies, to,
    username, exchangeRates
) => {
    const data = {};
    currencies.forEach((from) => {
        data[from] = parseFloat(exchangeRates.RAW[from][to].PRICE);
    });

    db.put({
        id,
        currencies: data,
        currency: to,
        username,
        date: (new Date()).toString(),
    });
};

export const proccesRate = async (message, currencies) => {
    const to = message.text.toUpperCase();
    const resp = await getExchangeRates(to, currencies);
    const exchangeRates = JSON.parse(resp);
    const id = generateId(message.chat.id, to);
    const gotItem = await db.get({id});
    const savedItem = gotItem.Item;

    log.info(savedItem);
    saveExchangeRates(id, currencies, to, message.from.username, exchangeRates);

    log.info(id);
    if (savedItem && savedItem.currencies) {
        log.info('format with percents');
        return formatResponseWithPercents(
            exchangeRates,
            to,
            savedItem.currencies
        );
    } else {
        return formatResponse(exchangeRates, to, currencies);
    }
};

const generateId = (id, to) => {
    return `${id.toString()}-${to}`;
};

export const formatResponseWithPercents = function(
    exchangeRates, to, currencies
) {
    const items = Object.keys(currencies).map((from) => {
        if (!exchangeRates.RAW[from] ||
            from === to ||
            isFiat(from) && isFiat(to)) return;

        const val = parseFloat(exchangeRates.RAW[from][to].PRICE);
        const change = calcChangedPercents(currencies[from], val).toFixed(1);

        return [
            change,
            `1 ${from} is *${val.toFixed(3)} ${to}* (${change}%)`,
        ];
    })
        .filter((v) => v)
        .sort((a, b) => {
            return b[0] - a[0];
        })
        .map((v) => v[1]);

    return items.join('\n');
};

const formatResponse = function(exchangeRates, to, currencies) {
    const items = currencies.map((from) => {
        if (isFiat(from) && isFiat(to)) return;

        return `1 ${from} is *${parseFloat(exchangeRates.RAW[from][to].PRICE).toFixed(3)} ${to}*`;
    });

    return `
${items.join('\n')}
`;
};

const calcChangedPercents = (from, to) => {
    const res = (100 / precisionRound(to, 3)) * precisionRound(from, 3);

    if (isNaN(res)) {
        return 0;
    }
    return 100 - res;
};

function precisionRound(number, precision) {
    const factor = Math.pow(10, precision);

    return Math.round(number * factor) / factor;
};
