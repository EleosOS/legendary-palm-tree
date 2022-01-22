import { PalmCommandOptions } from "./";
import * as palmMod from "../../"; // import all modules so they're accessable with eval
import { Utils, Constants } from "detritus-client";

const evalCommand: PalmCommandOptions = {
    name: "eval",
    aliases: ["e"],
    metadata: {
        hidden: true,
        description: palmMod.Strings.containment.beta.stringClassifiedAccessDenied,
        usage: palmMod.Strings.containment.beta.classified,
    },
    args: [
        { default: false, name: "noreply", type: "bool" },
        { default: 2, name: "jsonspacing", type: "number" },
    ],
    onBefore: (ctx) => ctx.user.isClientOwner,
    onCancel: (ctx) => ctx.reply(palmMod.Strings.commands.general.usageNotAllowed),
    run: async (ctx, args) => {
        const { matches } = Utils.regex(Constants.DiscordRegexNames.TEXT_CODEBLOCK, args.code);
        if (matches.length) {
            args.code = matches[0].text;
        }

        let language = "js";
        let message: unknown;
        try {
            message = await Promise.resolve(eval(args.code));
            if (typeof message === "object") {
                message = JSON.stringify(message, null, args.jsonspacing);
                language = "json";
            }
        } catch (error: any) {
            message = error ? error.stack || error.message : error;
        }

        const max = 1990 - language.length;
        if (!args.noreply) {
            return ctx.reply(["```" + language, String(message).slice(0, max), "```"].join("\n"));
        }
    },
    onError: (context, args, error) => {
        console.error(error);
    },
};

export default evalCommand;
