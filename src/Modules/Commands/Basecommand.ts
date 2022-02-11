import { Constants, Interaction, Structures, Utils } from "detritus-client";
import { BaseSet } from "detritus-client/lib/collections";
import { Signale, Config } from "../";
const { ApplicationCommandTypes, ApplicationCommandOptionTypes, MessageFlags } = Constants;

enum EoRStatus {
    NONE = 0,
    SUCCESS = 1,
    WARNING = 2,
    FAIL = 3,
    INFO = 4,
}

/**
 * Interaction.InteractionContext.editOrRespond(), but the response is forced to be ephemeral and edits strings into the normal form.
 * @param ctx
 * @param options
 * @param status What icon to add to the content
 * @returns Promise<unknown>
 */
function ephEoR(ctx: Interaction.InteractionContext, options: string | Structures.InteractionEditOrRespond, status?: EoRStatus) {
    let response: Structures.InteractionEditOrRespond = {
        flags: MessageFlags.EPHEMERAL,
    };

    if (typeof options === "string") {
        // Put string into norm and add status
        switch (status) {
            case undefined:
                options = `**${options}**`;
                break;

            case EoRStatus.NONE:
                break;

            case EoRStatus.SUCCESS:
                options = `✅  **${options}**`;
                break;

            case EoRStatus.WARNING:
                options = `⚠  **${options}**`;

            case EoRStatus.FAIL:
                options = `❌ **${options}**`;

            case EoRStatus.INFO:
                options = `ℹ  **${options}**`;

            default:
                break;
        }

        response.content = options;
    } else {
        response = {
            flags: MessageFlags.EPHEMERAL,
            ...options,
        };
    }

    return ctx.editOrRespond(response);
}

export class BaseInteractionCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommand<ParsedArgsFinished> {
    guildIds = new BaseSet([Config.guildId]);
    global = false;

    onError(ctx: Interaction.InteractionContext, args: ParsedArgsFinished, err: any) {
        Signale.error({
            prefix: ctx.command.name,
            message: err,
        });

        return this.ephEoR(ctx, `⚠  **Something went wrong.** \`${err}\``, 0);
    }

    onRunError(ctx: Interaction.InteractionContext, args: ParsedArgsFinished, err: any) {
        Signale.error({
            prefix: ctx.command.name,
            message: err,
        });

        return this.ephEoR(ctx, `⚠  **Something went wrong.** \`${err}\``, 0);
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
        return this.ephEoR(ctx, "This command can't be used in direct messages.", 2);
    }

    onRatelimit(ctx: Interaction.InteractionContext) {
        Signale.info({
            prefix: "ratelimit",
            message: `${ctx.user.name}#${ctx.user.discriminator} has reached ratelimit of ${ctx.command.name}.`,
        });

        return this.ephEoR(ctx, "You've reached the ratelimit. Slow down.", 2);
    }

    onPermissionsFail(ctx: Interaction.InteractionContext) {
        Signale.note({
            prefix: "command",
            message: `PermissionsFail - ${ctx.command.name} used by ${ctx.user.name}#${ctx.user.discriminator}}`,
        });

        return this.ephEoR(ctx, "You're not allowed to use this command.", 2);
    }

    onSuccess(ctx: Interaction.InteractionContext) {
        Signale.info({
            prefix: "command",
            message: `${ctx.command.name} used by ${ctx.user.name}#${ctx.user.discriminator}`,
        });
    }

    ephEoR = ephEoR;
}

export class BaseCommandOption<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = ApplicationCommandOptionTypes.SUB_COMMAND;
    ephEoR = ephEoR;
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
