import { changeRecringeHue } from "../../Bot";
import { PalmCommandOptions } from ".";
import { Strings } from "../../";

const hueCommand: PalmCommandOptions = {
    name: "hue",
    metadata: {
        hidden: true,
        description: "Changes the hue by amount.",
        usage: "hue",
    },
    ratelimit: {
        duration: 300000,
        limit: 3,
        type: "guild",
    },
    disableDm: true,
    type: [{ name: "amount" }],
    onBeforeRun: (ctx) => {
        // Don't run the command if the guild doesn't have an icon (just in case)
        if (ctx.guild!.iconUrl && ctx.user.isClientOwner) {
            return true;
        } else {
            return false;
        }
    },
    onCancelRun: (ctx) => ctx.editOrReply(Strings.commands.hue.noIconOrUsageNotAllowed),
    run: async (ctx, args) => {
        if (!args.amount) {
            args.amount = 10;
        }

        await changeRecringeHue(Number(args.amount));
        return ctx.editOrReply(Strings.commands.hue.iconHueManuallyChanged);
    },
};

export default hueCommand;
