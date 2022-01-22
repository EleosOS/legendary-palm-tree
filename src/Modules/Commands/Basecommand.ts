import { Constants, Interaction, Structures, Utils } from "detritus-client";
import { BaseSet } from "detritus-client/lib/collections";
import { Strings, Signale } from "..";
const { ApplicationCommandTypes, ApplicationCommandOptionTypes, MessageFlags } = Constants;
const { Embed, Markup } = Utils;

export class BaseInteractionCommand<ParsedArgsFinished = Interaction.ParsedArgs> extends Interaction.InteractionCommand<ParsedArgsFinished> {
    guildIds = new BaseSet(["649352572464922634"]);

    onDmBlocked(context: Interaction.InteractionContext) {
        return context.editOrRespond({
            content: Strings.commands.general.noDM,
            flags: MessageFlags.EPHEMERAL,
        });
    }

    onRunError(context: Interaction.InteractionContext, args: ParsedArgsFinished, error: any) {
        Signale.error({ prefix: context.command.name + " - RunError", message: error });

        return context.editOrRespond({
            content: Strings.bot.error.replace("?", String(error)),
            flags: MessageFlags.EPHEMERAL,
        });
    }

    onValueError(context: Interaction.InteractionContext, args: Interaction.ParsedArgs, errors: Interaction.ParsedErrors) {
        const embed = new Embed();
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
        return context.editOrRespond({
            embed,
            flags: MessageFlags.CROSSPOSTED,
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
