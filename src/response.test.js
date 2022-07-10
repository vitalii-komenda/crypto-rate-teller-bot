import {responseWithPercents} from './response';

test('responseWithPercents', async () => {
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

    const res = await responseWithPercents(
        exchangeRates,
        'ETH',
        {currencies, username: 'me'},
        2022
    );
    expect(res).toEqual(`Diff since the last me's call 2022 \n
1 EUR is *1000.100 ETH* (99.5%)
1 BTC is *10.100 ETH* (-8.7%)`);
});
