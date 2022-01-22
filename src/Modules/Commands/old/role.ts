import { PalmCommandOptions } from "./";
import { Signale, Strings, DB } from "../../";
import { Config } from "../../../config";
import { RowDataPacket } from "mysql2";

const roleCommand: PalmCommandOptions = {
    name: "role",
    metadata: {
        description: "Creates a custom role and assigns it to you.",
        usage: "role (hex) (role name)",
        edited: false,
    },
    ratelimit: {
        duration: 5000,
        limit: 1,
        type: "guild",
    },
    type: [{ name: "hex" }, { name: "rolename", consume: true }],
    onBeforeRun: (ctx, args) => {
        return /^#?([0-9A-Fa-f]{6})$/.test(args.hex) && args.rolename;
    },
    onCancelRun: (ctx) => {
        return ctx.editOrReply(Strings.commands.general.argsIncorrectOrIncomplete);
    },
    run: async (ctx, args) => {
        ctx.command!.metadata.edited = false;

        const guild = ctx.guilds.get("649352572464922634")!;
        let roleId: string;

        const result = await DB.query("SELECT roleId FROM customRoles WHERE userId = ?", [ctx.userId]);

        // result was successful AND result contains something AND the roleId of the result is not empty
        if (result && (result[0] as RowDataPacket[]).length > 0 && ((result[0] as any)[0].roleId as string).length > 0) {
            roleId = (result[0] as any)[0].roleId;

            guild.editRole(roleId, {
                name: args.rolename,
                color: Number("0x" + (args.hex as string).slice(1)),
                reason: Strings.commands.roles.userChangedRole,
            });

            ctx.command!.metadata.edited = true;
        } else {
            const newRole = await guild.createRole({
                name: args.rolename,
                color: Number("0x" + (args.hex as string).slice(1)),
            });

            roleId = newRole.id;
            guild.addMemberRole(ctx.userId, roleId);
        }

        guild.editRolePositions([
            {
                id: roleId,
                position: Math.floor(Math.random() * (guild.memberCount - 1)),
            },
        ]);

        await DB.query("UPDATE customRoles SET roleId = ? WHERE userId = ?", [roleId, ctx.userId]);
    },
    onSuccess: async (ctx, args) => {
        const guild = ctx.guilds.get("649352572464922634")!;

        if (ctx.command!.metadata.edited) {
            Signale.success({
                prefix: "role",
                message: `Edited role for ${ctx.user.name}, color: ${args.hex}, name: ${args.rolename}`,
            });
            ctx.editOrReply(Strings.commands.roles.roleEdited);
        } else {
            Signale.success({
                prefix: "role",
                message: `Created role for ${ctx.user.name}, color: ${args.hex}, name: ${args.rolename}`,
            });
            ctx.editOrReply(Strings.commands.roles.roleCreated);
        }

        const webhooks = await guild.fetchWebhooks();
        webhooks.get(Config.webhooks.customRoles)!.execute({
            avatarUrl: ctx.me!.avatarUrl,
            embed: {
                title: `Created/Edited role`,
                description: `Color: \`${args.hex}\`\nName: \`${args.rolename}\``,
                author: {
                    name: ctx.user.name,
                    iconUrl: ctx.user.avatarUrl,
                },
                color: Number("0x" + (args.hex as string).slice(1)),
            },
        });
    },
};

export default roleCommand;
