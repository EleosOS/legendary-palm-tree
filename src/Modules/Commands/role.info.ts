import jsonFile from 'jsonfile';
import { PalmCommandOptions } from './';
import { Signale } from '../Signale';

const roleInfoCommand: PalmCommandOptions = {
	name: 'role info',
	priority: 1,
	metadata: {
		description: 'Gives info on your custom role.',
		usage: 'role info'
	},
	ratelimit: {
		duration: 5000,
		limit: 1,
		type: 'guild'
	},
	run: async (ctx) => {
		const guild = ctx.guilds.get('649352572464922634')!;

		jsonFile.readFile(`./src/db/${ctx.userId}.json`)
			.then(async (data) => {
				if (data.roleId.length > 0) {
					const role = guild.roles.get(data.roleId)!;

					return ctx.editOrReply({
						embed: {
							title: 'Your custom role:',
							author: {
								name: ctx.user.name,
								iconUrl: ctx.user.avatarUrl
							},
							fields: [
								{
									name: 'Name',
									value: role.name
								},
								{
									name: 'Color',
									value: `#${role.color.toString(16)}`,
									inline: true
								},
								{
									name: 'Positon',
									value: `${role.position}`, // Typescript being Typescript...
									inline: true
								},
								{
									name: 'Mention',
									value: role.mention,
									inline: true
								}
							],
							color: role.color
						}
					});
				} else {
					return ctx.editOrReply('⚠  **You don\'t happen to have a custom role.**');
				}
			})
			.catch(e => Signale.error({ prefix: 'role', message: e }));
	}
};

export default roleInfoCommand;