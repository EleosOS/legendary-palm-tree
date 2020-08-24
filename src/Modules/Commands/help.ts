import { PalmCommandOptions } from './';

const helpCommand: PalmCommandOptions = {
	name: 'help',
	metadata: {
		description: 'w.',
		usage: 'help (command)'
	},
	ratelimit: {
		duration: 5000,
		limit: 3,
		type: 'guild'
	},
	type: [{ name: 'commandname', consume: true }],
	run: async (ctx, args) => {
		const command = ctx.commandClient.getCommand({ prefix: ctx.prefix!, content: args.commandname });

		if (!command) {
			return ctx.editOrReply('❌  **That command doesn\'t exist.**');
		} else {
			return ctx.editOrReply(`ℹ  ${command.name}\n**Description:** ${command.metadata.description}\n**Usage:** ${command.metadata.usage}`);
		}
	}
};

export default helpCommand;