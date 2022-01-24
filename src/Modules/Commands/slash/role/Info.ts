import { Interaction, Structures } from "detritus-client";
import { ApplicationCommandOptionTypes, MessageFlags } from "detritus-client/lib/constants";
import { Embed } from "detritus-client/lib/utils";
import { RowDataPacket } from "mysql2";

import { Strings, DB } from "../../..";
import { BaseCommandOption } from "../../Basecommand";

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
        const guild = ctx.guilds.get("649352572464922634")!;

        const result = await DB.query("SELECT roleId FROM customRoles WHERE userId = ?", [args.user.id]);

        if (result && (result[0] as RowDataPacket[]).length > 0 && ((result[0] as any)[0].roleId as string).length > 0) {
            const roleId = (result[0] as any)[0].roleId;
            const role = guild.roles.get(roleId)!;

            const embed = new Embed({
                author: {
                    name: `Custom Role of ${args.user.name}#${args.user.discriminator}`,
                    icon_url: args.user.avatarUrl,
                },
                title: role.name,
                fields: [
                    {
                        name: "Color",
                        value: `#${role.color.toString(16)}`,
                        inline: true,
                    },
                    {
                        name: "Positon",
                        value: `${role.position}`,
                        inline: true,
                    },
                    {
                        name: "Mention",
                        value: role.mention,
                        inline: true,
                    },
                ],
                color: role.color,
            });

            return ctx.editOrRespond({
                embeds: [embed],
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
