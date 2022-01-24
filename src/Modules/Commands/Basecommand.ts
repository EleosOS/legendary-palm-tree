import { Constants, Interaction, Structures, Utils } from "detritus-client";
import { BaseSet } from "detritus-client/lib/collections";
import { Strings, Signale } from "../";
import { Config } from "../../config";
const { ApplicationCommandTypes, ApplicationCommandOptionTypes, MessageFlags } = Constants;

export class BaseInteractionCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommand<ParsedArgsFinished> {
    guildIds = new BaseSet([Config.guildId]);
    global = false;

    onError(ctx: Interaction.InteractionContext, args: ParsedArgsFinished, error: any) {
        Signale.error({
            prefix: ctx.command.name + " - Error",
            message: error,
        });

        return ctx.editOrRespond({
            content: Strings.bot.error.replace("?", String(error)),
            flags: MessageFlags.EPHEMERAL,
        });
    }

    onRunError(ctx: Interaction.InteractionContext, args: ParsedArgsFinished, error: any) {
        Signale.error({
            prefix: ctx.command.name + " - RunError",
            message: error,
        });

        return ctx.editOrRespond({
            content: Strings.bot.error.replace("?", String(error)),
            flags: MessageFlags.EPHEMERAL,
        });
    }

    // TODO: Put own spin on this function, once I figure out when it triggers and what it actually does.
    onValueError(ctx: Interaction.InteractionContext, args: Interaction.ParsedArgs, errors: Interaction.ParsedErrors) {
        const embed = new Utils.Embed();
        embed.setTitle(`⚠ (PH) Argument Error`);

        const store: { [key: string]: string } = {};

        const description: Array<string> = ["Invalid Arguments" + "\n"];
        for (let key in errors) {
            const message = errors[key].message;
            if (message in store) {
                description.push(`**${key}**: Same error as **${store[message]}**`);
            } else {
                description.push(`**${key}**: ${message}`);
            }
            store[message] = key;
        }

        embed.setDescription(description.join("\n"));
        return ctx.editOrRespond({
            embed,
            flags: MessageFlags.CROSSPOSTED,
        });
    }

    onDmBlocked(ctx: Interaction.InteractionContext) {
        return ctx.editOrRespond({
            content: Strings.commands.general.noDM,
            flags: MessageFlags.EPHEMERAL,
        });
    }

    onRatelimit(ctx: Interaction.InteractionContext) {
        Signale.warn({
            prefix: "ratelimit",
            message: `${ctx.user.name}#${ctx.user.discriminator} has reached ratelimit of ${ctx.command.name}.`,
        });

        return ctx.editOrRespond({
            content: Strings.bot.ratelimitReached,
            flags: MessageFlags.EPHEMERAL,
        });
    }

    onPermissionsFail(ctx: Interaction.InteractionContext) {
        Signale.note({
            prefix: "command",
            message: `PermissionsFail - ${ctx.command.name} used by ${ctx.user.name}#${ctx.user.discriminator}}`,
        });

        return ctx.editOrRespond({
            content: Strings.commands.general.usageNotAllowed,
            flags: MessageFlags.EPHEMERAL,
        });
    }

    onSuccess(ctx: Interaction.InteractionContext) {
        Signale.info({
            prefix: "command",
            message: `${ctx.command.name} used by ${ctx.user.name}#${ctx.user.discriminator}`,
        });
    }
}

export class BaseCommandOption<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = ApplicationCommandOptionTypes.SUB_COMMAND;
}

export class BaseCommandOptionGroup<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
}

export class BaseSlashCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends BaseInteractionCommand<ParsedArgsFinished> {
    type = ApplicationCommandTypes.CHAT_INPUT;
}

export interface ContextMenuMessageArgs {
    message: Structures.Message;
}

export class BaseContextMenuMessageCommand extends BaseInteractionCommand<ContextMenuMessageArgs> {
    type = ApplicationCommandTypes.MESSAGE;
}

export interface ContextMenuUserArgs {
    member?: Structures.Member;
    user: Structures.User;
}

export class BaseContextMenuUserCommand extends BaseInteractionCommand<ContextMenuUserArgs> {
    type = ApplicationCommandTypes.USER;
}
