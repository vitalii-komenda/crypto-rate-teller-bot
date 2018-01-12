import * as handler from '../handler';


const commands = {};
command.btc = {
    "ok": true,
        "result": [
            {
                "update_id": 241264670,
                "message": {
                    "message_id": 631,
                    "from": {
                        "id": 6263644,
                        "is_bot": false,
                        "first_name": "Vitalii",
                        "last_name": "Komenda",
                        "username": "komenda",
                        "language_code": "en-UA"
                    },
                    "chat": {
                        "id": 6263644,
                        "first_name": "Vitalii",
                        "last_name": "Komenda",
                        "username": "komenda",
                        "type": "private"
                    },
                    "date": 1515772570,
                    "text": "btc"
                }
            }
        ]
};


test('wrote btc', async () => {
    const event = 'event';
    const context = 'context';
    const callback = (error, response) => {
        expect(response.statusCode).toEqual(200);
        expect(typeof response.body).toBe("string");
    };

    await handler.hello(event, context, callback);
});
