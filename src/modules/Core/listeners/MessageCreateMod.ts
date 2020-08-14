import { Listener, Module, ListenerData, GuildConfig } from 'axoncore';
import { Message, PrivateChannel } from 'eris';

class MessageCreateMod extends Listener {
    constructor(module: Module, data: ListenerData = {} ) {
        super(module, data);

        /** Event Name (Discord name) */
        this.eventName = 'messageCreate';
        /** Event name (Function name) */
        this.label = 'messageCreateMod';

        this.enabled = true;

        this.info = {
            owners: ['KhaaZ'],
            description: 'Log Message Create events',
        };
    }

    execute(message: Message, guildConfig: GuildConfig) {
        if (message.channel instanceof PrivateChannel) {
            return Promise.resolve();
        }
        console.log(`Prefix: ${guildConfig.prefixes}`);
        return Promise.resolve();
    }
}

export default MessageCreateMod;
