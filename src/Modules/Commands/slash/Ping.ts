import { Interaction } from "detritus-client";
import { InteractionCallbackTypes, MessageFlags } from "detritus-client/lib/constants";

import { BaseSlashCommand } from "../Basecommand";

class PingCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "ping",
            description: "Launches a nuke",
        });
    }

    async run(ctx: Interaction.InteractionContext) {
        const { gateway, rest } = await ctx.client.ping();

        return ctx.respond({
            type: InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Pong! - Gateway: \`${gateway}ms\` Rest: \`${rest}ms\``,
                flags: MessageFlags.EPHEMERAL,
            },
        });
    }
}

export default PingCommand;
