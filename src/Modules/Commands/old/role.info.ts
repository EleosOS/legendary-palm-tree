import { PalmCommandOptions } from "./";
import { Strings, DB } from "../../";
import { RowDataPacket } from "mysql2";

const roleInfoCommand: PalmCommandOptions = {
    name: "role info",
    priority: 1,
    metadata: {
        description: "Gives info on your custom role.",
        usage: "role info",
    },
    ratelimit: {
        duration: 5000,
        limit: 1,
        type: "guild",
    },
    run: async (ctx) => {
        const guild = ctx.guilds.get("649352572464922634")!;

        const result = await DB.query("SELECT roleId FROM customRoles WHERE userId = ?", [ctx.userId]);

        if (result && (result[0] as RowDataPacket[]).length > 0 && ((result[0] as any)[0].roleId as string).length > 0) {
            const roleId = (result[0] as any)[0].roleId;
            const role = guild.roles.get(roleId)!;

            return ctx.editOrReply({
                embed: {
                    title: "Your custom role:",
                    author: {
                        name: ctx.user.name,
                        iconUrl: ctx.user.avatarUrl,
                    },
                    fields: [
                        {
                            name: "Name",
                            value: role.name,
                        },
                        {
                            name: "Color",
                            value: `#${role.color.toString(16)}`,
                            inline: true,
                        },
                        {
                            name: "Positon",
                            value: `${role.position}`, // Typescript being Typescript...
                            inline: true,
                        },
                        {
                            name: "Mention",
                            value: role.mention,
                            inline: true,
                        },
                    ],
                    color: role.color,
                },
            });
        } else {
            return ctx.editOrReply(Strings.commands.roles.noRole);
        }
    },
};

export default roleInfoCommand;
