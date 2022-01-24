import { Interaction, Structures } from "detritus-client";
import { ApplicationCommandOptionTypes, MessageFlags } from "detritus-client/lib/constants";
import { RowDataPacket } from "mysql2";

// This is ridiculous
import { Config } from "../../../../config";
import { Strings, DB } from "../../..";
import { BaseCommandOption } from "../../Basecommand";
import { createInfoEmbed } from "./createInfoEmbed";

interface RoleInfoArgs {
    user: Structures.Member | Structures.User;
}

class RoleInfoCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "info",
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

    async run(ctx: Interaction.InteractionContext, args: RoleInfoArgs) {
        const guild = ctx.guilds.get(Config.guildId)!;

        const result = await DB.query("SELECT roleId FROM customRoles WHERE userId = ?", [args.user.id]);

        if (result && (result[0] as RowDataPacket[]).length > 0 && ((result[0] as any)[0].roleId as string).length > 0) {
            const roleId = (result[0] as any)[0].roleId;
            const role = guild.roles.get(roleId)!;

            return ctx.editOrRespond({
                embeds: [createInfoEmbed(args.user, role)],
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

export default RoleInfoCommand;
