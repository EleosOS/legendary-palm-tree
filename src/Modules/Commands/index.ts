import pingCommand from './ping';
import evalCommand from './eval';
import { CommandOptions } from 'detritus-client/lib/command';

export interface PalmCommandOptions extends CommandOptions {
	name: string
	metadata: {
		hidden?: boolean
		description: string
		usage: string
	}
}

export default [
	pingCommand,
	evalCommand
];
