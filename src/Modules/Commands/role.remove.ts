import jsonFile from 'jsonfile';
import { PalmCommandOptions } from './';
import { Signale } from '../Signale';

const roleRemoveCommand: PalmCommandOptions = {
	name: 'role remove',
	priority: 1,
	metadata: {
		description: 'Removes a custom role.',
		usage: 'role remove'
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
					await guild.deleteRole(data.roleId, { reason: 'User created new custom role' });

					jsonFile.writeFile(`./src/db/${ctx.userId}.json`, { roleId: '' })
						.catch(e => Signale.error({ prefix: 'role', message: e }));
				}
			})
			.catch(e => Signale.error({ prefix: 'role', message: e }));
	},
	onSuccess: async (ctx) => {
		Signale.success({ prefix: 'role', message: `Removed role for ${ctx.user.name}` });
		ctx.editOrReply('✅  **Custom role removed.**');

		if (ctx.guild) {
			const webhooks = await ctx.guild.fetchWebhooks();
			webhooks.get('749390079272681544')!.execute({
				avatarUrl: ctx.me!.avatarUrl,
				embed: {
					title: `Removed role`,
					author: {
						name: ctx.user.name,
						iconUrl: ctx.user.avatarUrl
					},
				}
			});	
		}
	}
};

export default roleRemoveCommand;