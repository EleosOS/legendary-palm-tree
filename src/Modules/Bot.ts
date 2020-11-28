import { CommandClient, Constants, ShardClient } from 'detritus-client';
import Jimp from 'jimp';
import jsonFile from 'jsonfile';
import { Config } from '../config';
import { Signale } from './Signale';
import Commands from './Commands';

export const Bot = new CommandClient(Config.token, {
	prefixes: [ 'os', 'i cast '],
	useClusterClient: false,
	gateway: {
		presence: {
			activity: {
				name: 'prefix: os',
				type: 0
			  /*type: 4,
				emoji: {
					name: ':white_circle:',
					animated: false,
					id: null
				}*/
			}
		}
	}
});

Bot.on(Constants.ClientEvents.COMMAND_FAIL, (e) => {
	Signale.fatal({ prefix: e.command.name + ' - Fail', message: e.error });
	void e.context.editOrReply(`⚠  Something went wrong. Error: \`${e.error.message}\``);
});

Bot.on(Constants.ClientEvents.COMMAND_ERROR, (e) => {
	if (e.command.disableDm) {
		return;
	}

	Signale.error({ prefix: e.command.name + ' - Error', message: e.error });
	void e.context.editOrReply(`⚠  Something went wrong. Error: \`${e.error.message}\``);
});

Bot.on(Constants.ClientEvents.COMMAND_RATELIMIT, (r) => {
	Signale.warn({ prefix: 'ratelimit', message: `${r.context.user.name}#${r.context.user.discriminator} has reached ratelimit of ${r.command.name}.`});
	void r.context.editOrReply('⚠  You\'ve reached the ratelimit. Slow down.');
});

export async function changeRecringeHue(amount: number) {
	const client = (Bot.client as ShardClient);
	const guild = client.guilds.get('649352572464922634')!;
	const image = await Jimp.read(guild.iconUrl!);

	image.color([ { apply: 'hue', params: [amount] } ]);

	await guild!.edit({
		icon: await image.getBufferAsync('image/png')
	});

	let { currentHue } = await jsonFile.readFile('./src/db/hue.json');
	currentHue = Number(currentHue);
	currentHue += amount;

	if (currentHue >= 360) currentHue -= 360;

	jsonFile.writeFileSync('./src/db/hue.json', { currentHue });

	(await guild.fetchWebhooks()).get('749389905880285274')!.execute({
		avatarUrl: client.user!.avatarUrl,
		embed: {
			title: `Hue has been changed. (${currentHue})`,
			author: {
				name: 'os',
				iconUrl: client.user!.avatarUrl
			},
			image: {
				url: guild.iconUrl!
			}
		}
	});

	Signale.note({ prefix: 'hue', message: `Hue has been changed. (${currentHue})`});
}

/*
Bot.on(Constants.ClientEvents.GUILD_MEMBER_ADD, (a) => {

});*/

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