import evalCommand from './eval';
import helpCommand from './help';
import hueCommand from './hue';
import pingCommand from './ping';
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
	evalCommand,
	helpCommand,
	hueCommand,
	pingCommand,
	roleCommand,
	roleRemoveCommand,
];
