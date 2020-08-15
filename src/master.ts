import { bot, signale } from './Modules'

bot.connect();

bot.once('ready', () => {
    signale.complete({prefix:'startup', message: 'Bot is ready!'});
});