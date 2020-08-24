import pingCommand from './ping';
import evalCommand from './eval';
import roleCommand from './role';
import roleRemoveCommand from './role.remove';
import { CommandOptions } from 'detritus-client/lib/command';

export interface PalmCommandOptions extends CommandOptions {
	name: string
	metadata: {
		hidden?: boolean
		description: string
		usage: string,
		[key: string]: any
	}
}

export default [
	pingCommand,
	evalCommand,
	roleCommand,
	roleRemoveCommand
];
