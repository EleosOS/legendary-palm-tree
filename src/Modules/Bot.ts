import { CommandClient } from 'eris';
import { commands } from './Commands';
import { signale } from './Signale';
import config from '../config.json';

const commandOptions = {
    description: 'bot',
    owner: 'Eleos#0010',
    prefix: ['@mention', 'n', 'nat', 'i cast '],
};

export const bot = new CommandClient(config.token, {}, commandOptions);

bot.on('error', (e: Error) => {
    signale.error(e);
});

commands.forEach((element) => {
    const command = bot.registerCommand(element.label, element.execute, element.options);
    signale.info({prefix: 'commands', message:`Command registred: ${element.label}`});

    if (element.subcommands) {
        element.subcommands.forEach((subcommand) => {
            command.registerSubcommand(subcommand.label, subcommand.execute, subcommand.options);
            signale.info({prefix: 'commands', message:`${element.label} > Subcommand registred: ${subcommand.label}`});
        })
    }
});