export default (bot, log, proccesRate, currencies) => {
    bot.hears(
        new RegExp(`^(${currencies.join('|')})$`, 'i'),
        async (ctx) => {
            log.info('inside bindRate');
            const content = await proccesRate(
                ctx.message,
                currencies
            );

            return ctx.reply(content);
        }
    );
};
