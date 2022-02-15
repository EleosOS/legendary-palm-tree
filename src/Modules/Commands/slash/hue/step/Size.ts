import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes, Permissions } from "detritus-client/lib/constants";

import { CronManager, Hue, Webhooks, changeServerIconHue } from "../../../../";
import { BaseCommandOption } from "../../../";

interface HueStepSizeCommandArgs {
    amount: number;
}

class HueStepSizeCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "size",
            description: "[ADMIN] Change by how much the hue should automatically change",
            options: [
                {
                    name: "amount",
                    description: "How many degrees the hue should be changed, between 1 and 359",
                    required: true,
                    type: ApplicationCommandOptionTypes.INTEGER,
                },
            ],
        });
    }

    onBeforeRun(ctx: Interaction.InteractionContext, args: HueStepSizeCommandArgs) {
        return !(args.amount < 0 || args.amount > 359);
    }

    onCancelRun(ctx: Interaction.InteractionContext) {
        return this.ephEoR(ctx, "`amount` needs to be between 1 and 359.", 2);
    }

    async run(ctx: Interaction.InteractionContext, args: HueStepSizeCommandArgs) {
        const hue = await Hue.findOne(1);

        if (!hue) {
            return this.ephEoR(ctx, "No hue value is saved in the Database, it needs to be changed once.", 3);
        }

        const stepSizeBefore = hue.stepSize;
        hue.stepSize = args.amount;
        await hue.save();

        CronManager.removeTask("hueChange");

        CronManager.addTask("hueChange", hue.cronExpression, () => {
            changeServerIconHue(hue.stepSize);
        });

        Webhooks.execute(Webhooks.ids.serverImgHue, {
            avatarUrl: ctx.me!.avatarUrl,
            embed: {
                title: "Auto hue change size edited",
                author: {
                    name: ctx.me!.username,
                    iconUrl: ctx.me!.avatarUrl,
                },
                fields: [
                    {
                        name: "New",
                        value: `${hue.stepSize}°`,
                        inline: true,
                    },
                    {
                        name: "Old",
                        value: `°${stepSizeBefore}°`,
                        inline: true,
                    },
                ],
            },
        });

        return this.ephEoR(ctx, `The step size of the automatic hue change has been set to ${hue.stepSize}° (was ${stepSizeBefore}°)`, 1);
    }
}

export default HueStepSizeCommand;
