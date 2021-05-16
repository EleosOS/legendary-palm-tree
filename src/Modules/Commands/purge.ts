import { PalmCommandOptions } from "./";
import { Strings } from "../";
import { BaseCollection } from "detritus-client/lib/collections";
import { Message } from "detritus-client/lib/structures";

const purgeCommand: PalmCommandOptions = {
    name: "purge",
    metadata: {
        description: "Deletes 2-100 messages in a channel.",
        usage: "purge (amount of messages)",
    },
    disableDm: true,
    ratelimit: {
        duration: 5000,
        limit: 1,
        type: "guild",
    },
    type: [{ name: "amount", type: Number }],
    onBeforeRun: (ctx, args) => ctx.user.isClientOwner && !ctx.inDm,
    onCancelRun: (ctx) =>
        ctx.editOrReply(Strings.commands.general.usageNotAllowed),
    run: async (ctx, args) => {
        if (isNaN(args.amount)) {
            return ctx.editOrReply(
                Strings.commands.general.argsIncorrectOrIncomplete
            );
        } else if (args.amount > 100) {
            args.amount = 100;
        } else if (args.amount < 2) {
            args.amount = 2;
        }

        const messages: BaseCollection<
            string,
            Message
        > = await ctx.channel!.fetchMessages({
            limit: args.amount,
        });

        if (messages.length < 2) {
            return false;
        }

        await ctx.channel
            ?.bulkDelete(
                messages.map((v, k) => {
                    return k;
                })
            )
            .then(async () => {
                const msg = await ctx.editOrReply(
                    Strings.commands.purge.deletedMessages.replace(
                        "?",
                        args.amount.toString()
                    )
                );

                setTimeout(
                    await msg.delete({ reason: "Purged messages" }),
                    15000
                );
            });
    },
    onCancel: (ctx) => ctx.editOrReply(Strings.commands.purge.failed),
};

export default purgeCommand;
