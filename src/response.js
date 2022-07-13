const FIATS = ['EUR', 'USD', 'UAH'];
const isFiat = (currency) => {
    return FIATS.indexOf(currency.toUpperCase()) !== -1;
};
const calcChangedPercents = (from, to) => {
    const res = (100 / round(to, 3)) * round(from, 3);

    if (isNaN(res)) {
        return 0;
    }
    return 100 - res;
};

export function round(number, precision) {
    const factor = Math.pow(10, precision);

    return Math.round(number * factor) / factor;
};

export const responseWithPercents = function(
    exchangeRates, to, {currencies, savedDate}, date
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

    return `Diff between *${savedDate}* - *${date}*
\n${items.join('\n')}`;
};

export const response = function(exchangeRates, to, currencies) {
    const items = currencies.map((from) => {
        if (isFiat(from) && isFiat(to)) return;
        const price = parseFloat(exchangeRates.RAW[from][to].PRICE).toFixed(3);

        return `1 ${from} is *${price} ${to}*`;
    });

    return `
${items.join('\n')}
`;
};
