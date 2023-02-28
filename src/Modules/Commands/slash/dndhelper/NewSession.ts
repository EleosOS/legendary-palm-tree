import { Interaction } from "detritus-client";
import { BaseCollection } from "detritus-client/lib/collections";
import { ApplicationCommandOptionTypes, Permissions } from "detritus-client/lib/constants";
import { Message } from "detritus-client/lib/structures";

import { BaseSlashCommand } from "../..";

interface PurgeArgs {
    amount: number;
}

class NewSessionCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "newdndsession",
            description: "[SPECIAL] Automatically creates a new event and scheduling thread for the next DnD session.",
            permissionsClient: [Permissions.MANAGE_EVENTS],
            ratelimit: {
                duration: 3000,
                limit: 1,
                type: "guild",
            },
            options: [
                {
                    name: "description",
                    description: "Overrides the session name, if given will not automatically add session number",
                    type: ApplicationCommandOptionTypes.STRING,
                },
                {
                    name: "name",
                    description: "Overrides the session name, if given will not automatically add session number",
                    type: ApplicationCommandOptionTypes.STRING,
                },
                {
                    name: "number",
                    description: "Overrides the session number",
                    type: ApplicationCommandOptionTypes.INTEGER,
                },
            ],
        });
    }

    onBeforeRun(ctx: Interaction.InteractionContext, args: PurgeArgs) {
        return !(args.amount < 2 || args.amount > 100);
    }

    onCancelRun(ctx: Interaction.InteractionContext) {
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
                this.ephEoR(ctx, `Deleted ${messages.length} messages.`, 1);
            });
    }
}

export default NewSessionCommand;
