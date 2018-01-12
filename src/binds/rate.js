export default (bot, log, db, currencies, getRate) => {
    bot.hears(
        new RegExp(`^(${currencies.join('|')})$`, 'i'),
        async (ctx) => {
            log.info('inside bindRate');

            if (ctx.message.text) {
                const content = await getRate(ctx.message, db);
                return ctx.reply(content);
            } else {
                return ctx.reply('do not know this currency');
            }
        }
    );
};
