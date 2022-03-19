import { Interaction } from "detritus-client";
import { BaseCollection } from "detritus-client/lib/collections";
import { Permissions } from "detritus-client/lib/constants";
import { Message } from "detritus-client/lib/structures";

import { BaseContextMenuMessageCommand, ContextMenuMessageArgs } from "..";

class PurgeBelowContextCommand extends BaseContextMenuMessageCommand {
    constructor() {
        super({
            name: "Purge Below",
            permissions: [Permissions.ADMINISTRATOR],
            permissionsClient: [Permissions.MANAGE_MESSAGES],
        });
    }

    async run(ctx: Interaction.InteractionContext, args: ContextMenuMessageArgs) {
        const messages: BaseCollection<string, Message> = await ctx.channel!.fetchMessages({
            after: args.message.id,
            limit: 100,
        });

        if (messages.length < 2) {
            return this.ephEoR(ctx, "There were not enough messages to purge.", 2);
        }

        return ctx.channel
            ?.bulkDelete(
                messages.map((v, k) => {
                    return k;
                })
            )
            .then(() => {
                this.ephEoR(ctx, `Deleted ${messages.length} messages.`, 1);
            });
    }
}

export default PurgeBelowContextCommand;
