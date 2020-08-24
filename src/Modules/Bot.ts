import { CommandClient } from 'detritus-client';
import { Config } from '../config';
import { Signale } from './Signale';
import Commands from './Commands';

export const Bot = new CommandClient(Config.token, {
	prefixes: [ 'os', 'i cast ']
});

Bot.on('commandFail', (e) => {
	Signale.fatal({ prefix: e.command.name + ' - Fail', message: e.error });
	void e.context.editOrReply(`⚠  Something went wrong. Error: \`${e.error.message}\``);
});

Bot.on('commandError', (e) => {
	Signale.error({ prefix: e.command.name + ' - Error', message: e.error });
	void e.context.editOrReply(`⚠  Something went wrong. Error: \`${e.error.message}\``);
});

Bot.on('commandRatelimit', (r) => {
	Signale.warn({ prefix: 'ratelimit', message: `${r.context.user.name}#${r.context.user.discriminator} has reached ratelimit of ${r.command.name}.`});
	void r.context.editOrReply('⚠  You\'ve reached the ratelimit. Slow down.');
});

Bot.addMultiple(Commands);

const commandsSorted = Bot.commands.slice().sort((a, b) => {
	const nameA = a.name.toUpperCase();
	const nameB = b.name.toUpperCase();

	if (nameA < nameB) {
		return -1;
	} else if (nameA > nameB) {
		return 1;
	} else {
		return 0;
	}
});

commandsSorted.forEach((command) => {
	Signale.info({ prefix: 'startup', message: 'Command found:', suffix: command.name });
});