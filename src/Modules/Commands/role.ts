import { PalmCommandOptions } from './';

const roleCommand: PalmCommandOptions = {
	name: 'role',
	aliases: ['r'],
	metadata: {
		description: 'Creates a custom role and assigns it to you.',
		usage: 'role (hex) (role name)'
	},
	type: [{ name: 'hex', help:'sees', required: true }, { name: 'roleName', required: true }],
};