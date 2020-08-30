import { PalmCommandOptions } from './';
import { Utils, Constants } from 'detritus-client';

const evalCommand: PalmCommandOptions = {
	label: 'code',
	name: 'eval',
	aliases: ['e'],
	metadata: {
		hidden: true,
		description: 'Eval JS code.',
		usage: 'eval (code)'
	},
	args: [
		{ default: false, name: 'noreply', type: 'bool' },
		{ default: 2, name: 'jsonspacing', type: 'number' },
	],
	onBefore: (ctx) => ctx.user.isClientOwner,
	onCancel: (ctx) => ctx.reply('⚠  **You\'re not allowed to use this command.**'),
	run: async (ctx, args) => {
		const { matches } = Utils.regex(Constants.DiscordRegexNames.TEXT_CODEBLOCK, args.code);
		if (matches.length) {
			args.code = matches[0].text;
		}

		let language = 'js';
		let message: unknown;
		try {
			message = await Promise.resolve(eval(args.code));
			if (typeof (message) === 'object') {
				message = JSON.stringify(message, null, args.jsonspacing);
				language = 'json';
			}
		} catch (error) {
			message = (error) ? error.stack || error.message : error;
		}

		const max = 1990 - language.length;
		if (!args.noreply) {
			return ctx.reply([
				'```' + language,
				String(message).slice(0, max),
				'```',
			].join('\n'));
		}
	},
	onError: (context, args, error) => {
		console.error(error);
	},
}

export default evalCommand;