import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes, Permissions } from "detritus-client/lib/constants";

import { Signale, Config, CustomRole, Webhooks } from "../../..";
import { BaseCommandOption } from "../../Basecommand";
import { createInfoEmbed } from "./createInfoEmbed";

interface CustomRoleCreateArgs {
    hex: string;
    rolename: string;
}

class CustomRoleCreateCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "create",
            description: "Creates a custom role and assigns it to you",
            metadata: {
                edited: false,
                cachedRole: undefined,
            },
            ratelimit: {
                duration: 5000,
                limit: 1,
                type: "user",
            },
            permissionsClient: [Permissions.MANAGE_ROLES],
            options: [
                {
                    name: "hex",
                    description: "Hex color code, e.g.: #123456",
                    required: true,
                    type: ApplicationCommandOptionTypes.STRING,
                },
                {
                    name: "rolename",
                    description: "Name of the role",
                    required: true,
                    type: ApplicationCommandOptionTypes.STRING,
                },
            ],
        });
    }

    onBeforeRun(ctx: Interaction.InteractionContext, args: CustomRoleCreateArgs) {
        return /^#?([0-9A-Fa-f]{6})$/.test(args.hex);
    }

    onCancelRun(ctx: Interaction.InteractionContext, args: CustomRoleCreateArgs) {
        return this.ephEoR(ctx, `${args.hex} is not a valid hex code.`, 2);
    }

    async run(ctx: Interaction.InteractionContext, args: CustomRoleCreateArgs) {
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
                position: Math.floor(Math.random() * ((await CustomRole.count()) - 1)),
            },
        ]);
    }

    async onSuccess(ctx: Interaction.InteractionContext, args: CustomRoleCreateArgs) {
        const verb = ctx.command.metadata.edited ? "Edited" : "Created";

        const embed = createInfoEmbed(ctx.user, this.metadata.cachedRole);
        embed.setAuthor(`${verb} custom role of ${ctx.user.name}#${ctx.user.discriminator}`);

        Signale.success({
            prefix: "role",
            message: `${verb} role for ${ctx.user.name}, color: ${args.hex}, name: ${args.rolename}`,
        });

        Webhooks.execute(Webhooks.ids.customRoles, {
            avatarUrl: ctx.me!.avatarUrl,
            embed: embed,
        });

        return this.ephEoR(ctx, { embed });
    }
}

export default CustomRoleCreateCommand;
