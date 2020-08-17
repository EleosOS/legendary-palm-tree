import { MoustacheCommand } from './index';
import { bot, signale } from '../index';

import jsonFile from 'jsonfile';

const roleRemove: MoustacheCommand = {
	execute: async (msg) => {
		const guild = bot.guilds.get('649352572464922634')!;

		// Check if user already has an assigned role
		// If they do, remove it
		jsonFile.readFile(`./src/db/${msg.author.id}.json`)
			.then((data) => {
				guild.removeMemberRole(msg.author.id, data.roleID, 'User removed custom role')
					.then(async () => {
						await guild.deleteRole(data.roleID);

						jsonFile.writeFile(`./src/db/${msg.author.id}.json`, { roleID: '' })
							.catch((err) => {
								return signale.error({ prefix: 'commands > role remove (write)', message: err });
							});
					})
					.catch((err) => {
						signale.error({ prefix: 'commands > role remove (read)', message: err });
					});
			})
			.catch((err) => {
				signale.error({ prefix: 'commands > role remove (read)', message: err });
			});

		return '**Custom role removed.**';
	},
	label: 'remove',
	options: {
		description: 'Removes your custom role.',
		fullDescription: 'Removes your custom role if you have one.',
		usage: ''
	}
}

export const role: MoustacheCommand = {
	execute: async (msg, args) => {
		const hex = args[0].split('#')[1];
		let numberHex;
		const name = args.slice(1).join(' ');
		const guild = bot.guilds.get('649352572464922634')!;

		if (args.length < 1) {
			return '**The role color and name are missing!**'
		} else if (args.length < 2) {
			return '**The role requires a name!**'
		}

		// Check if the hex is correct, then create valid number
		if (!/^#?([0-9A-Fa-f]{6})$/.test(hex)) {
			return 'The given hex code is invalid!';
		} else {
			numberHex = Number('0x' + hex);
		}

		// Check if user already has an assigned role
		// If they do, remove it
		jsonFile.readFile(`./src/db/${msg.author.id}.json`, (err, data) => {
			if (err) {
				signale.error({ prefix: 'commands > role (read)', message: err });
			} else if (data) {
				guild.removeMemberRole(msg.author.id, data.roleID, 'User created new custom role')
					.then(() => {
						guild.deleteRole(data.roleID);
					})
					.catch((err) => { });
			}
		});

		// Create a new role with inputs
		const newRole = await guild.createRole({
			name,
			color: numberHex
		});

		// Assign the new role
		await guild.addMemberRole(msg.author.id, newRole.id);

		// Create/Overwrite a json file with username and roleID
		jsonFile.writeFile(`./src/db/${msg.author.id}.json`, { roleID: newRole.id }, (err) => {
			if (err) {
				signale.error({ prefix: 'commands > role (write)', message: err });
			}
		});

		signale.success({ prefix: 'commands > role', message: `Created role for ${msg.author.username}, color: ${numberHex}, name: ${name}` });
		return '**Custom role assigned.**';
	},
	label: 'role',
	options: {
		description: 'Makes a new custom role.',
		fullDescription: 'Makes a new role with the color and name given and assigns it to you.',
		usage: 'nrole (hex *e.g. #41DD27*) (role name)',
	},
	subcommands: [roleRemove]
}

