import { Message, CommandOptions } from 'eris';
import { evalCmd } from './eval';
import { ping } from './ping';

export const commands: MoustacheCommand[] = [
    evalCmd,
    ping,
];

export interface MoustacheCommand {
    execute: (msg: Message, args: string[]) => Promise<string | Message>;
    label: string;
    options: MoustacheOptions;
    subcommands?: MoustacheCommand[];
}

interface MoustacheOptions extends CommandOptions {
    description: string;
    fullDescription: string;
    usage: string;
}
