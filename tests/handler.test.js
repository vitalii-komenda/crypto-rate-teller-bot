import {formatResponseWithPercents} from '../src/net';


const command = {};
command.btc = {
    'ok': true,
    'result': [
        {
            'update_id': 241264670,
            'message': {
                'message_id': 631,
                'from': {
                    'id': 6263641,
                    'is_bot': false,
                    'first_name': 'Ivan',
                    'last_name': 'LASTNAME',
                    'username': 'ivan',
                    'language_code': 'en-UA',
                },
                'chat': {
                    'id': 6263641,
                    'first_name': 'Ivan',
                    'last_name': 'LASTNAME',
                    'username': 'ivan',
                    'type': 'private',
                },
                'date': 1515772570,
                'text': 'eth',
            },
        },
    ],
};


// test('wrote btc', async () => {
//     // const event = 'event';
//     // const context = 'context';
//     // const callback = (error, response) => {
//     //     expect(response.statusCode).toEqual(200);
//     //     expect(typeof response.body).toBe('string');
//     // };

//     // await handler.hello(event, context, callback);
// });

test('getRate', async () => {
    const currencies = {
        BTC: 10.9782,
        ETH: 1.5,
        EUR: 5,
    };
    const exchangeRates = {
        RAW: {
            ETH: {
                BTC: {
                    PRICE: 0.1,
                },
                EUR: {
                    PRICE: 1000.1,
                },
            },
            BTC: {
                ETH: {
                    PRICE: 10.1,
                },
                EUR: {
                    PRICE: 9.1,
                },
            },
            EUR: {
                ETH: {
                    PRICE: 1000.1,
                },
                BTC: {
                    PRICE: 10000.1,
                },
            },
        },
    };
    const db = {
        get() {
            return Promise.resolve({
                Item: {
                    currencies,
                },
            });
        },
        put() {
            return Promise.resolve({});
        },
    };

    const res = await formatResponseWithPercents(
        exchangeRates,
        'ETH',
        currencies
    );
    expect(res).toEqual(`1 EUR is *1000.100 ETH* (99.5%)
1 BTC is *10.100 ETH* (-8.7%)`);
});
