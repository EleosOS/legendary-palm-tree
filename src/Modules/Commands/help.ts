import { PalmCommandOptions } from './';

const helpCommand: PalmCommandOptions = {
	name: 'help',
	metadata: {
		description: 'w.',
		usage: 'help [command]'
	},
	ratelimit: {
		duration: 5000,
		limit: 3,
		type: 'guild'
	},
	type: [{ name: 'commandname', consume: true }],
	run: async (ctx, args) => {
		if (args.commandname.length > 0) {
			const command = ctx.commandClient.getCommand({ prefix: ctx.prefix!, content: args.commandname });

			if (!command) {
				return ctx.editOrReply('❌  **That command doesn\'t exist.**');
			} else if (command.metadata.hidden) {
				return ctx.editOrReply('❌  **That command doesn\'t exist.**');
			} else {
				return ctx.editOrReply(`ℹ  **os${command.name}**\n**Description:** ${command.metadata.description}\n**Usage:** ${command.metadata.usage}`);
			}
		} else {
			let string = 'ℹ  **List of commands**\n';
			const commandsSorted = ctx.commandClient.commands.sort((a, b) => {
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
				if (command.metadata.hidden) return;

				return string += '\n' + command.name;
			});

			string += '\n\n**For more infos on a command type `oshelp [command]`.**';

		 	return ctx.editOrReply(string);
		}
	}
};

export default helpCommand;