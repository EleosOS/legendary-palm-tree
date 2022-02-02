import { Interaction } from "detritus-client";
import { MessageFlags } from "detritus-client/lib/constants";

import { CustomRole } from "../../../../Entities";
import { Config } from "../../../../config";
import { Signale } from "../../..";
import { BaseCommandOption } from "../../Basecommand";

class RoleRemoveCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "remove",
            description: "Removes a custom role.",
            ratelimit: {
                duration: 5000,
                limit: 1,
                type: "user",
            },
        });
    }

    async run(ctx: Interaction.InteractionContext) {
        const guild = ctx.guilds.get(Config.guildId)!;

        const result = await CustomRole.findOne({ where: { userId: ctx.userId } });

        if (result) {
            await guild.deleteRole(result.roleId, {
                reason: "User removed custom role",
            });

            result.remove();
        } else {
            return this.ephEoR(ctx, "This user doesn't have a custom role.", 2);
        }
    }

    async onSuccess(ctx: Interaction.InteractionContext) {
        const guild = ctx.guilds.get("649352572464922634")!;

        Signale.success({
            prefix: "role",
            message: `Removed role for ${ctx.user.name}#${ctx.user.discriminator}`,
        });

        (await guild.fetchWebhooks()).get(Config.webhooks.customRoles)!.execute({
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

export default RoleRemoveCommand;
