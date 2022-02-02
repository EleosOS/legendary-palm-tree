import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes, MessageFlags, Permissions } from "detritus-client/lib/constants";

import { Strings, changeRecringeHue } from "../../..";
import { BaseCommandOption } from "../../Basecommand";

interface HueChangeCommandArgs {
    amount: number;
}

class HueChangeCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "change",
            description: "[ADMIN] Changes the hue of the server picture by the specified amount",
            permissions: [Permissions.ADMINISTRATOR],
            ratelimit: {
                duration: 10000,
                limit: 1,
                type: "guild",
            },
            options: [
                {
                    name: "amount",
                    description: "How many degrees the hue should be changed",
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
        return this.ephEoR(ctx, Strings.commands.hue.noIcon);
    }

    async run(ctx: Interaction.InteractionContext, args: HueChangeCommandArgs) {
        if (args.amount === 0) {
            args.amount = 10;
        }

        await changeRecringeHue(args.amount);

        return this.ephEoR(ctx, Strings.commands.hue.iconHueManuallyChanged.replace("?", args.amount.toString()));
    }
}

export default HueChangeCommand;
