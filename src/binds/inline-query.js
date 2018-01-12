export default (bot, log, proccesRate, currencies) => {
    bot.on('inline_query', async (ctx) => {
        const to = ctx.inlineQuery.query.toUpperCase();
        if (to.length != 3) {
            return;
        }
        log.info('inline_query');
        log.info(ctx.inlineQuery);

        const content = await proccesRate({
            text: to,
            chat: {id: ctx.inlineQuery.from.id},
        }, currencies);
        const result = [{
            id: ctx.inlineQuery.query,
            type: 'article',
            cache_time: 2,
            title: `Show rate`,
            input_message_content: {
                parse_mode: 'markdown',
                message_text: content,
            },
        }];
        ctx.answerInlineQuery(result);
    });
};
