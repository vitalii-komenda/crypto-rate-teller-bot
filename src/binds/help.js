export default (bot) => {
    bot.command(
        'help',
        (ctx) => ctx.reply('Type currency name to see rates (for example EUR)')
    );
};
