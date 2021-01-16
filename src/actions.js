const log = require('lambda-log');
const db = require('./db');
const response = require('./response');
const net = require('./net');
db.init();

export const exchangeRate = async (message, currencies) => {
    const currency = message.text.toUpperCase();
    const resp = await net.getExchangeRates(currency, currencies);
    log.info(`got resp ${resp}`);
    const exchangeRates = JSON.parse(resp);
    const id = generateId(message.chat.id, currency);
    const item = (await db.get({id})).Item;
    log.info(item);

    const preparedCurrencies = {};
    currencies.forEach((from) => {
        preparedCurrencies[from] = parseFloat(
            exchangeRates.RAW[from] ?
                exchangeRates.RAW[from][currency].PRICE
                : 0
        );
    });
    db.put({
        id,
        currencies: preparedCurrencies,
        currency,
        username: message.from.username,
        date: (new Date()).toString(),
    });

    log.info(id);
    if (item && item.currencies) {
        log.info('format with percents');
        return response.responseWithPercents(
            exchangeRates,
            currency,
            {currencies: item.currencies, username: item.username}
        );
    } else {
        return response.response(exchangeRates, currency, currencies);
    }
};

const generateId = (id, currency) => {
    return `${id.toString()}-${currency}`;
};
