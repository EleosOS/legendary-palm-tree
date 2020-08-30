import { changeRecringeHue } from '../Bot';
import { PalmCommandOptions } from '.';

const hueCommand: PalmCommandOptions = {
	name: 'hue',
	metadata: {
		hidden: true,
		description: 'Triggers a hue change.',
		usage: 'hue'
	},
	ratelimit: {
		duration: 300000,
		limit: 3,
		type: 'guild'
	},
	disableDm: true,
	onBeforeRun: (ctx) => {
		// Don't run the command if the guild doesn't have an icon
		if (ctx.guild!.iconUrl && ctx.user.isClientOwner) {
			return true;
		} else {
			return false;
		}
	},
	onCancelRun: ctx => ctx.editOrReply('⚠  **This server doesn\'t have an icon or you\'re not allowed to use this command.**'),
	run: async (ctx) => {
		await changeRecringeHue();
		return ctx.editOrReply('✅  **The server icon hue has been manually changed.**');
	}
};

export default hueCommand;