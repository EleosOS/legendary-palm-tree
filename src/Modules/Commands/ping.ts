import { MoustacheCommand } from './index';
import { bot } from '../index';

export const ping: MoustacheCommand = {
    execute: async (msg) => {
        const start = Date.now();

        const mess = await bot.createMessage(msg.channel.id, 'Pong! ');

        if (!mess) {
            return 'Something went wrong. In the ping command. Unacceptable performance.';
        }

        const diff = (Date.now() - start);

        return mess.edit(`Pong! \`${diff}ms\``);
    },
    label: 'ping',
    options: {
        description: 'It\'s a ping command. What did you expect?',
        fullDescription: 'It\'s actually a secret eval command that everyone can use.\n*Just kidding.*',
        usage: ''
    }
}

