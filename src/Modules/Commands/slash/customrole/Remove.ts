import { Interaction } from "detritus-client";
import { Permissions } from "detritus-client/lib/constants";

import { Signale, Config, CustomRole, Webhooks } from "../../..";
import { BaseCommandOption } from "../..";

class CustomRoleRemoveCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "remove",
            description: "Removes a custom role",
            permissionsClient: [Permissions.MANAGE_ROLES],
            ratelimit: {
                duration: 5000,
                limit: 1,
                type: "user",
            },
        });
    }

    async run(ctx: Interaction.InteractionContext) {
        const guild = ctx.guilds.get(Config.guildId)!;

        const result = await CustomRole.findOneBy({
            userId: ctx.userId,
        });

        if (result) {
            await guild.deleteRole(result.roleId, {
                reason: "User removed custom role",
            });

            result.remove();
        } else {
            return this.ephEoR(ctx, "You don't have a custom role.", 2);
        }
    }

    onSuccess(ctx: Interaction.InteractionContext) {
        Signale.success({
            prefix: "role",
            message: `Removed role for ${ctx.user.name}#${ctx.user.discriminator}`,
        });

        Webhooks.execute(Webhooks.ids.customRoles, {
            avatarUrl: ctx.me!.avatarUrl,
            embed: {
                title: "Removed custom role",
                author: {
                    name: `${ctx.user.name}#${ctx.user.discriminator}`,
                    iconUrl: ctx.user.avatarUrl,
                },
            },
        });

        return this.ephEoR(ctx, "Custom role removed.", 1);
    }
}

export default CustomRoleRemoveCommand;
