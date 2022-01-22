import { Constants, Interaction, Structures, Utils } from "detritus-client";
import { InteractionCallbackTypes, MessageFlags, MessageTypes } from "detritus-client/lib/constants";
const { ApplicationCommandOptionTypes } = Constants;

import { BaseSlashCommand } from "../Basecommand";

export class PingCommand extends BaseSlashCommand {
    description = "Interaction command test";
    name = "ping";

    async run(ctx: Interaction.InteractionContext) {
        const { gateway, rest } = await ctx.client.ping();

        await ctx.respond({
            type: InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Pong! - Gateway: \`${gateway}ms\` Rest: \`${rest}ms\``,
                flags: MessageFlags.EPHEMERAL,
            },
        });
    }
}
