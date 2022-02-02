import { Interaction, Structures } from "detritus-client";
import { ApplicationCommandOptionTypes, MessageFlags } from "detritus-client/lib/constants";

import { CustomRole } from "../../../../Entities";
import { Config } from "../../../../config";
import { Signale } from "../../..";
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
        return this.ephEoR(ctx, `${args.hex} is not a valid hex code.`, 2);
    }

    async run(ctx: Interaction.InteractionContext, args: RoleCreateArgs) {
        ctx.command!.metadata.edited = false;

        const guild = ctx.guilds.get(Config.guildId)!;
        let roleId: string;

        // Find existing custom role entry
        let result = await CustomRole.findOne({ where: { userId: ctx.userId } });

        if (result) {
            // Entry exists, just edit role

            this.metadata.cachedRole = await guild.editRole(result.roleId, {
                name: args.rolename,
                color: Number("0x" + (args.hex as string).slice(1)),
                reason: "User changed role settings",
            });

            roleId = this.metadata.cachedRole.id;

            ctx.command!.metadata.edited = true;
        } else {
            // No entry exists => No custom role exists => Create new role
            this.metadata.cachedRole = await guild.createRole({
                name: args.rolename,
                color: Number("0x" + (args.hex as string).slice(1)),
            });

            roleId = this.metadata.cachedRole.id;

            // Save in DB
            result = new CustomRole();
            result.userId = ctx.userId;
            result.roleId = roleId;
            result.save();

            await guild.addMemberRole(ctx.userId, roleId);
        }

        // Random role position
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

        (await guild.fetchWebhooks()).get(Config.webhooks.customRoles)!.execute({
            avatarUrl: ctx.me!.avatarUrl,
            embed: embed,
        });

        return this.ephEoR(ctx, { embed });
    }
}

export default RoleCreateCommand;
