import { Interaction } from "detritus-client";
import { BaseCollection } from "detritus-client/lib/collections";
import { ApplicationCommandOptionTypes, MessageFlags, Permissions } from "detritus-client/lib/constants";
import { Message } from "detritus-client/lib/structures";

import { Strings } from "../..";
import { BaseSlashCommand } from "../Basecommand";

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
        return ctx.editOrRespond({
            content: Strings.commands.purge.failedInvalidArgs,
            flags: MessageFlags.EPHEMERAL,
        });
    }

    async run(ctx: Interaction.InteractionContext, args: PurgeArgs) {
        const messages: BaseCollection<string, Message> = await ctx.channel!.fetchMessages({
            limit: args.amount,
        });

        if (messages.length < 2) {
            return ctx.editOrRespond({
                content: Strings.commands.purge.failedNotEnough,
                flags: MessageFlags.EPHEMERAL,
            });
        }

        return ctx.channel
            ?.bulkDelete(
                messages.map((v, k) => {
                    return k;
                })
            )
            .then(async () => {
                return ctx.editOrRespond({
                    content: Strings.commands.purge.deletedMessages.replace("?", args.amount.toString()),
                    flags: MessageFlags.EPHEMERAL,
                });
            });
    }
}

export default PurgeCommand;
