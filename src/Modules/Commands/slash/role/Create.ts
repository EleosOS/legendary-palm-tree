import { Interaction, Structures } from "detritus-client";
import { ApplicationCommandOptionTypes, MessageFlags } from "detritus-client/lib/constants";
import { RowDataPacket } from "mysql2";

import { Config } from "../../../../config";
import { Strings, Signale, DB } from "../../..";
import { BaseCommandOption } from "../../Basecommand";
import { createInfoEmbed } from "./createInfoEmbed";

interface RoleCreateArgs {
    hex: string;
    rolename: string;
}

class RoleCreateCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "create",
            description: "Creates a custom role and assigns it to you.",
            metadata: {
                edited: false,
                cachedRole: undefined,
            },
            ratelimit: {
                duration: 5000,
                limit: 1,
                type: "user",
            },
            options: [
                {
                    name: "hex",
                    description: "Hex color code, e.g.: #000000",
                    required: true,
                    type: ApplicationCommandOptionTypes.STRING,
                },
                {
                    name: "rolename",
                    description: "Name of that your role should have",
                    required: true,
                    type: ApplicationCommandOptionTypes.STRING,
                },
            ],
        });
    }

    onBeforeRun(ctx: Interaction.InteractionContext, args: RoleCreateArgs) {
        return /^#?([0-9A-Fa-f]{6})$/.test(args.hex);
    }

    onCancelRun(ctx: Interaction.InteractionContext, args: RoleCreateArgs) {
        return ctx.editOrRespond({
            content: Strings.commands.roles.badHex.replace("?", args.hex),
            flags: MessageFlags.EPHEMERAL,
        });
    }

    async run(ctx: Interaction.InteractionContext, args: RoleCreateArgs) {
        ctx.command!.metadata.edited = false;

        const guild = ctx.guilds.get(Config.guildId)!;
        let roleId: string;

        const result = await DB.query("SELECT roleId FROM customRoles WHERE userId = ?", [ctx.userId]);

        // result was exists (was successful) AND result contains something AND the roleId of the result is not empty
        if (result && (result[0] as RowDataPacket[]).length > 0 && ((result[0] as any)[0].roleId as string).length > 0) {
            roleId = (result[0] as any)[0].roleId;

            this.metadata.cachedRole = await guild.editRole(roleId, {
                name: args.rolename,
                color: Number("0x" + (args.hex as string).slice(1)),
                reason: Strings.commands.roles.userChangedRole,
            });

            ctx.command!.metadata.edited = true;
        } else {
            this.metadata.cachedRole = await guild.createRole({
                name: args.rolename,
                color: Number("0x" + (args.hex as string).slice(1)),
            });

            roleId = this.metadata.cachedRole.id;

            await DB.query("INSERT INTO customRoles(userId, roleId) VALUES (?, ?)", [ctx.userId, this.metadata.cachedRole.id]);

            await guild.addMemberRole(ctx.userId, roleId);
        }

        await guild.editRolePositions([
            {
                id: roleId,
                position: Math.floor(Math.random() * (guild.memberCount - 1)),
            },
        ]);
    }

    async onSuccess(ctx: Interaction.InteractionContext, args: RoleCreateArgs) {
        const guild = ctx.guilds.get("649352572464922634")!;
        const verb = ctx.command.metadata.edited ? "Edited" : "Created";

        const embed = createInfoEmbed(ctx.user, this.metadata.cachedRole);
        embed.setAuthor(`${verb} custom role of ${ctx.user.name}#${ctx.user.discriminator}`);

        Signale.success({
            prefix: "role",
            message: `${verb} role for ${ctx.user.name}, color: ${args.hex}, name: ${args.rolename}`,
        });

        ctx.editOrRespond({
            embed: embed,
            flags: MessageFlags.EPHEMERAL,
        });

        const webhooks = await guild.fetchWebhooks();
        webhooks.get(Config.webhooks.customRoles)!.execute({
            avatarUrl: ctx.me!.avatarUrl,
            embed: embed,
        });
    }
}

export default RoleCreateCommand;
