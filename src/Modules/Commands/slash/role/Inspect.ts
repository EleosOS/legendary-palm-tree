import { Interaction, Structures } from "detritus-client";
import { ApplicationCommandOptionTypes, MessageFlags } from "detritus-client/lib/constants";

import { CustomRole } from "../../../../Entities";
import { Config } from "../../../../config";
import { Strings } from "../../..";
import { BaseCommandOption } from "../../Basecommand";
import { createInfoEmbed } from "./createInfoEmbed";

interface RoleInspectArgs {
    user: Structures.Member | Structures.User;
}

class RoleInspectCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "inspect",
            description: "Lists info on the custom role of a user",
            disableDm: true,
            ratelimit: {
                duration: 3000,
                limit: 1,
                type: "user",
            },
            options: [
                {
                    name: "user",
                    description: "User of the custom role",
                    required: true,
                    type: ApplicationCommandOptionTypes.USER,
                    default: (ctx: Interaction.InteractionContext) => ctx.member || ctx.user,
                },
            ],
        });
    }

    async run(ctx: Interaction.InteractionContext, args: RoleInspectArgs) {
        const guild = ctx.guilds.get(Config.guildId)!;

        const result = await CustomRole.findOne({ where: { userId: args.user.id } });

        if (result) {
            const role = guild.roles.get(result.roleId)!;

            return ctx.editOrRespond({
                embed: createInfoEmbed(args.user, role),
                flags: MessageFlags.EPHEMERAL,
            });
        } else {
            return ctx.editOrRespond({
                content: Strings.commands.roles.noRole,
                flags: MessageFlags.EPHEMERAL,
            });
        }
    }
}

export default RoleInspectCommand;
