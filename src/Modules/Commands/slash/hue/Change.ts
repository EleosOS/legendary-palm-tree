import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes, Permissions } from "detritus-client/lib/constants";

import { changeServerIconHue, checkIfGuildIconIsGif } from "../../..";
import { BaseCommandOption } from "../../";

interface HueChangeCommandArgs {
    amount: number;
}

class HueChangeCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "change",
            description: "[ADMIN] Changes the hue of the server picture by the specified amount",
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

    async run(ctx: Interaction.InteractionContext, args: HueChangeCommandArgs) {
        if (args.amount === 0) {
            args.amount = 10;
        }

        await changeServerIconHue(args.amount);

        return this.ephEoR(ctx, `The server icon hue has been manually changed by ${args.amount}°`, 1);
    }
}

export default HueChangeCommand;
