import {getRate} from '../src/controller';


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
                'text': 'btc',
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
    const db = {
        get() {
            return Promise.resolve({
                Item: {
                    currencies: {
                        BTC: 150,
                    },
                },
            });
        },
        put() {
            return Promise.resolve({
                Item: {
                    currencies: {
                        BTC: 150,
                    },
                },
            });
        },
    };

    expect(getRate(command.btc.result[0].message, db)).toEqual(1);
});
