const log = require('lambda-log');
const db = require('./db');
const response = require('./response');
const net = require('./net');
const dateAndTime = require('date-and-time');

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
    const date = new Date();
    db.put({
        id,
        currencies: preparedCurrencies,
        currency,
        username: message.from.username,
        date: date.toString(),
    });

    log.info(id);
    if (item && item.currencies) {
        log.info('format with percents');
        const datePassed = dateAndTime.subtract(date, new Date(item.date));

        return response.responseWithPercents(
            exchangeRates,
            currency,
            {
                currencies: item.currencies,
            },
            `${datePassed.toDays().toFixed(0)} days or ${datePassed.toHours().toFixed(0)} hours or ${datePassed.toMinutes().toFixed(0)} minutes`
        );
    } else {
        return response.response(exchangeRates, currency, currencies);
    }
};

const generateId = (id, currency) => {
    return `${id.toString()}-${currency}`;
};
