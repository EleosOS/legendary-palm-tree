import jsonFile from 'jsonfile';
import { PalmCommandOptions } from './';
import { Signale } from '../Signale';

const roleCommand: PalmCommandOptions = {
	name: 'role',
	metadata: {
		description: 'Creates a custom role and assigns it to you.',
		usage: 'role (hex) (role name)'
	},
	ratelimit: {
		duration: 5000,
		limit: 1,
		type: 'guild'
	},
	type: [{ name: 'hex' }, { name: 'rolename', consume: true }],
	onBeforeRun: (ctx, args) => {
		return /^#?([0-9A-Fa-f]{6})$/.test(args.hex) && args.rolename;
	},
	onCancelRun: (ctx) => {
		return ctx.editOrReply('⚠  **The given args are incorrect or incomplete.**');
	},
	run: async (ctx, args) => {
		const guild = ctx.guilds.get('649352572464922634')!;

		jsonFile.readFile(`./src/db/${ctx.userId}.json`)
			.then((data) => {
				if (data.roleId.length > 0) {
					guild.deleteRole(data.roleId, { reason: 'User created new custom role' });
				}
			})
			.catch(e => Signale.error({ prefix: 'role', message: e }));

		const newRole = await guild.createRole({
			name: args.rolename,
			color: Number('0x' + (args.hex as string).slice(1))
		});

		await guild.addMemberRole(ctx.userId, newRole.id);

		jsonFile.writeFile(`./src/db/${ctx.userId}.json`, { roleId: newRole.id })
			.catch(e => Signale.error({ prefix: 'role', message: e }));
	},
	onSuccess: (ctx, args) => {
		Signale.success({ prefix: 'role', message: `Created role for ${ctx.user.name}, color: ${args.hex}, name: ${args.rolename}` });
		return ctx.editOrReply('✅  **Custom role assigned.**');
	}
};

export default roleCommand;