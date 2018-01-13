import {formatResponseWithPercents} from '../src/net';

test('formatResponseWithPercents', async () => {
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

    const res = await formatResponseWithPercents(
        exchangeRates,
        'ETH',
        currencies
    );
    expect(res).toEqual(`1 EUR is *1000.100 ETH* (99.5%)
1 BTC is *10.100 ETH* (-8.7%)`);
});
