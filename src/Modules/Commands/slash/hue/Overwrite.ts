import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes, MessageFlags, Permissions } from "detritus-client/lib/constants";

import { Hue } from "../../../../Entities";
import { Strings } from "../../..";
import { BaseCommandOption } from "../../Basecommand";
import { Config } from "../../../../config";

interface HueOverwriteCommandArgs {
    amount: number;
}

class HueOverwriteCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "overwrite",
            description: "[ADMIN] Overwrite the stored hue value without changing the server icon",
            permissions: [Permissions.ADMINISTRATOR],
            ratelimit: {
                duration: 10000,
                limit: 1,
                type: "guild",
            },
            options: [
                {
                    name: "amount",
                    description: "What the hue value should be set as, between 0 and 360.",
                    required: true,
                    type: ApplicationCommandOptionTypes.INTEGER,
                },
            ],
        });
    }

    async onBeforeRun(ctx: Interaction.InteractionContext) {
        return ctx.guild!.iconUrl !== null;
    }

    async onCancelRun(ctx: Interaction.InteractionContext) {
        return ctx.editOrRespond({
            content: Strings.commands.hue.noIcon,
            flags: MessageFlags.EPHEMERAL,
        });
    }

    async run(ctx: Interaction.InteractionContext, args: HueOverwriteCommandArgs) {
        if (args.amount < 0 || args.amount > 360) {
            return ctx.editOrRespond({
                content: "⚠  **amount needs to be between 0 and 360.**",
                flags: MessageFlags.EPHEMERAL,
            });
        }

        // Find Hue
        const hue = await Hue.findOne(1);

        if (!hue) {
            return ctx.editOrRespond({
                content: "⚠  **No hue value is saved in the Database, it needs to be changed once.**",
                flags: MessageFlags.EPHEMERAL,
            });
        }

        // Save new value
        const hueBefore = hue.currentHue;
        hue.currentHue = args.amount;
        await hue.save();

        // Notify
        (await ctx.guild!.fetchWebhooks()).get(Config.webhooks.serverImgHue)!.execute({
            avatarUrl: ctx.me!.avatarUrl,
            embed: {
                title: `Hue value has been overwritten to ${hue.currentHue} (was ${hueBefore})`,
                author: {
                    name: "os",
                    iconUrl: ctx.me!.avatarUrl,
                },
            },
        });

        return ctx.editOrRespond({
            content: `✅  **Hue value has been overwritten to ${hue.currentHue} (was ${hueBefore}).**`,
            flags: MessageFlags.EPHEMERAL,
        });
    }
}

export default HueOverwriteCommand;
