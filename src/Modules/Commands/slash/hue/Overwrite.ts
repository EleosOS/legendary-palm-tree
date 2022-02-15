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
            ratelimit: {
                duration: 10000,
                limit: 1,
                type: "guild",
            },
            options: [
                {
                    name: "amount",
                    description: "What the hue value should be set as, between 0 and 360",
                    required: true,
                    type: ApplicationCommandOptionTypes.INTEGER,
                },
            ],
        });
    }

    onBeforeRun(ctx: Interaction.InteractionContext, args: HueOverwriteCommandArgs) {
        return args.amount < 0 || args.amount > 360;
    }

    onCancelRun(ctx: Interaction.InteractionContext) {
        return this.ephEoR(ctx, "`amount` needs to be between 0 and 360.", 2);
    }

    async run(ctx: Interaction.InteractionContext, args: HueOverwriteCommandArgs) {
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
                title: `Icon hue value has been overwritten`,
                author: {
                    name: ctx.me!.username,
                    iconUrl: ctx.me!.avatarUrl,
                },
                fields: [
                    {
                        name: "New",
                        value: `${hue.currentHue}°`,
                        inline: true,
                    },
                    {
                        name: "Old",
                        value: `${hueBefore}°`,
                        inline: true,
                    },
                ],
            },
        });

        return this.ephEoR(ctx, `Hue value has been overwritten to ${hue.currentHue} (was ${hueBefore}).`, 1);
    }
}

export default HueOverwriteCommand;
