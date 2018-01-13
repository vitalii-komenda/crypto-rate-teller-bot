import {handle} from './handler';

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


test('should return empty', async () => {
    const event = 'event';
    const context = 'context';
    const callback = (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toBe('string');
        expect(response.body).toEqual('Body is empty');
    };

    await handle(event, context, callback);
});
