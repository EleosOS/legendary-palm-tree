import { bot } from '../';
import { MoustacheCommand } from './';
import { inspect } from 'util';

export const evalCmd: MoustacheCommand = {
    // Shamelessly copied from AxonCore (with some edits). You should check it out.
    execute: async (msg, args) => {
        try {
            const modules = {
                bot: bot,
            };

            // tslint:disable-next-line: no-eval
            let evaled = await eval(args.join(' '));

            if (typeof evaled === 'object') {
                evaled = inspect(evaled, { depth: 0, showHidden: true });
            } else {
                evaled = String(evaled);
            }

            // Just in case.
            evaled = evaled.split(bot.token).join('[Something is not allowing you to see this part of the message.]');

            const charlength = evaled.length;

            if (evaled.length === 0) {
                return;
            }

            if (evaled.length > 2000) {
                evaled = evaled.match(/[\s\S]{1,1900}[\n\r]/g) || [];
                if (evaled.length > 3) {
                bot.createMessage(msg.channel.id, `Cut the response! [${evaled.length} | ${charlength}]`);
                bot.createMessage(msg.channel.id, `\`\`\`js\n${evaled[0]}\`\`\``);
                bot.createMessage(msg.channel.id, `\`\`\`js\n${evaled[1]}\`\`\``);
                bot.createMessage(msg.channel.id, `\`\`\`js\n${evaled[2]}\`\`\``);
                return;
            } else {
                    return evaled.forEach((message: string) => {
                        bot.createMessage(msg.channel.id, `\`\`\`js\n${message}\`\`\``);
                        return;
                    });
                }
            }

            return bot.createMessage(msg.channel.id, `\`\`\`js\n${evaled}\`\`\``);
        } catch (err) {
            console.log(err.stack);
            return bot.createMessage(msg.channel.id, err.message ? err.message : err.name);
        }
    },
    label: 'eval',
    options: {
        description: 'Eval JS code.',
        fullDescription: '[Something is blocking this part of the message, you can\'t decipher what it reads.]',
        usage: '',
        aliases: ['e'],
        requirements: {
            userIDs: ['249880389160665089'],
        },
    },
};
