import { Interaction, Structures } from "detritus-client";
import { ApplicationCommandOptionTypes } from "detritus-client/lib/constants";

import { Config, CustomRole } from "../../../";
import { BaseCommandOption } from "../../";
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

            return this.ephEoR(ctx, { embed: createInfoEmbed(args.user, role) });
        } else {
            return this.ephEoR(ctx, "This user doesn't have a custom role.", 2);
        }
    }
}

export default RoleInspectCommand;
