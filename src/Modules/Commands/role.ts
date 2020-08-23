import { PalmCommandOptions } from './';

const roleCommand: PalmCommandOptions = {
	name: 'role',
	aliases: ['r'],
	metadata: {
		description: 'Creates a custom role and assigns it to you.',
		usage: 'role (hex) (role name)'
	},
	type: [{ name: 'hex', help:'sees' }, { name: 'roleName' }],
	onBeforeRun: (ctx, args) => {
		if (args.hex) {
			return /^#?([0-9A-Fa-f]{6})$/.test(args.hex);
		} else if (!args.roleName) {
			return false;
		} else {
			return true;
		}
	},
	onCancelRun: (ctx) => {
		return ctx.editOrReply('⚠ The given args are incorrect or incomplete.');
	},
	run: (ctx, args) => {
		console.log(args);
	},
};

export default roleCommand;