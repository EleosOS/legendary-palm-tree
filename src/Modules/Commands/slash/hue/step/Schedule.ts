import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes, Permissions } from "detritus-client/lib/constants";

import { CronManager, Hue, Webhooks, changeServerIconHue } from "../../../../";
import { BaseCommandOption } from "../../../";

interface HueStepScheduleCommandArgs {
    cronexpression: string;
}

class HueStepScheduleCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "schedule",
            description: "[ADMIN] Reschedule when and how often the hue should be changed. Don't abuse the Discord API!",
            options: [
                {
                    name: "cronexpression",
                    description: "A valid cron expression of the schedule (without seconds), see e.g. https://crontabkit.com/",
                    required: true,
                    type: ApplicationCommandOptionTypes.STRING,
                },
            ],
        });
    }

    onBeforeRun(ctx: Interaction.InteractionContext, args: HueStepScheduleCommandArgs) {
        return CronManager.validate(args.cronexpression);
    }

    onCancelRun(ctx: Interaction.InteractionContext) {
        return this.ephEoR(ctx, "The cron expression is invalid. Make sure you are not using seconds in the expression.", 2);
    }

    async run(ctx: Interaction.InteractionContext, args: HueStepScheduleCommandArgs) {
        const hue = await Hue.findOne(1);

        if (!hue) {
            return this.ephEoR(ctx, "No hue value is saved in the Database, it needs to be changed once.", 3);
        }

        const cronExpressionBefore = hue.cronExpression;
        hue.cronExpression = args.cronexpression;
        await hue.save();

        CronManager.removeTask("hueChange");

        CronManager.addTask("hueChange", hue.cronExpression, () => {
            changeServerIconHue(hue.stepSize);
        });

        Webhooks.execute(Webhooks.ids.serverImgHue, {
            avatarUrl: ctx.me!.avatarUrl,
            embed: {
                title: "Auto hue change rescheduled",
                author: {
                    name: ctx.me!.username,
                    iconUrl: ctx.me!.avatarUrl,
                },
                fields: [
                    {
                        name: "New",
                        value: `\`${hue.cronExpression}\``,
                        inline: true,
                    },
                    {
                        name: "Old",
                        value: `\`${cronExpressionBefore}\``,
                        inline: true,
                    },
                ],
            },
        });

        return this.ephEoR(ctx, `The automatic hue change has been rescheduled to \`${hue.cronExpression}\` (was \`${cronExpressionBefore}\`)`, 1);
    }
}

export default HueStepScheduleCommand;
