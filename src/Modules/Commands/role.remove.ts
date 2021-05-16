import { PalmCommandOptions } from "./";
import { Signale, Strings, DB } from "../";
import { Config } from "../../config";
import { RowDataPacket } from "mysql2";

const roleRemoveCommand: PalmCommandOptions = {
    name: "role remove",
    priority: 1,
    metadata: {
        description: "Removes a custom role.",
        usage: "role remove",
    },
    ratelimit: {
        duration: 5000,
        limit: 1,
        type: "guild",
    },
    run: async (ctx) => {
        const guild = ctx.guilds.get("649352572464922634")!;

        const result = await DB.query(
            "SELECT roleId FROM customRoles WHERE userId = ?",
            [ctx.userId]
        );

        if (
            result &&
            (result[0] as RowDataPacket[]).length > 0 &&
            ((result[0] as any)[0].roleId as string).length > 0
        ) {
            const roleId = (result[0] as any)[0].roleId;

            guild.deleteRole(roleId, {
                reason: Strings.commands.roles.userRemovedRole,
            });

            DB.query('UPDATE customRoles SET roleId = "" WHERE userId = ?', [
                ctx.userId,
            ]);
        } else {
            ctx.editOrReply(Strings.commands.roles.noRole);
            return false;
        }
    },
    onSuccess: async (ctx) => {
        const guild = ctx.guilds.get("649352572464922634")!;

        Signale.success({
            prefix: "role",
            message: `Removed role for ${ctx.user.name}`,
        });
        ctx.editOrReply(Strings.commands.roles.roleRemoved);

        const webhooks = await guild.fetchWebhooks();
        webhooks.get(Config.webhooks.customRoles)!.execute({
            avatarUrl: ctx.me!.avatarUrl,
            embed: {
                title: "Removed role",
                author: {
                    name: ctx.user.name,
                    iconUrl: ctx.user.avatarUrl,
                },
            },
        });
    },
};

export default roleRemoveCommand;
