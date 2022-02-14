import { Interaction } from "detritus-client";
import { BaseCollection } from "detritus-client/lib/collections";
import { ApplicationCommandOptionTypes, Permissions } from "detritus-client/lib/constants";
import { Message } from "detritus-client/lib/structures";

import { BaseSlashCommand } from "../";

interface PurgeArgs {
    amount: number;
}

class PurgeCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "purge",
            description: "[ADMIN] Deletes 2-100 messages in a channel.",
            disableDm: true,
            permissions: [Permissions.ADMINISTRATOR],
            permissionsClient: [Permissions.MANAGE_MESSAGES],
            ratelimit: {
                duration: 3000,
                limit: 1,
                type: "guild",
            },
            options: [
                {
                    name: "amount",
                    description: "How many messages to delete, between 2 and 100",
                    required: true,
                    type: ApplicationCommandOptionTypes.INTEGER,
                    default: 2,
                },
            ],
        });
    }

    async onBeforeRun(ctx: Interaction.InteractionContext, args: PurgeArgs) {
        return !(args.amount < 2 || args.amount > 100);
    }

    async onCancelRun(ctx: Interaction.InteractionContext) {
        return this.ephEoR(ctx, "Only 2-100 messages can be deleted at a time.", 2);
    }

    async run(ctx: Interaction.InteractionContext, args: PurgeArgs) {
        const messages: BaseCollection<string, Message> = await ctx.channel!.fetchMessages({
            limit: args.amount,
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
                this.ephEoR(ctx, `Deleted ${args.amount} messages.`, 1);
            });
    }
}

export default PurgeCommand;
