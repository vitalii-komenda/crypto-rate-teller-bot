const log = require('lambda-log');
const request = require('request');

exports.getExchangeRates = function(to, currencies) {
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
