import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes, MessageFlags, Permissions } from "detritus-client/lib/constants";

import { Hue, Webhooks } from "../../../";
import { BaseCommandOption } from "../../";

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
        return this.ephEoR(ctx, "This server doesn't have an icon.", 3);
    }

    async run(ctx: Interaction.InteractionContext, args: HueOverwriteCommandArgs) {
        if (args.amount < 0 || args.amount > 360) {
            return this.ephEoR(ctx, "`amount` needs to be between 0 and 360.", 2);
        }

        // Find Hue
        const hue = await Hue.findOne(1);

        if (!hue) {
            return this.ephEoR(ctx, "No hue value is saved in the Database, it needs to be changed once.", 3);
        }

        // Save new value
        const hueBefore = hue.currentHue;
        hue.currentHue = args.amount;
        await hue.save();

        // Notify
        Webhooks.execute(Webhooks.ids.serverImgHue, {
            avatarUrl: ctx.me!.avatarUrl,
            embed: {
                title: `Hue value has been overwritten to ${hue.currentHue} (was ${hueBefore})`,
                author: {
                    name: ctx.me!.username,
                    iconUrl: ctx.me!.avatarUrl,
                },
            },
        });

        return this.ephEoR(ctx, `Hue value has been overwritten to ${hue.currentHue} (was ${hueBefore}).`, 1);
    }
}

export default HueOverwriteCommand;
