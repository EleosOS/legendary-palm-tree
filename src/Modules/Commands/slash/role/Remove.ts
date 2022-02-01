import { Interaction } from "detritus-client";
import { MessageFlags } from "detritus-client/lib/constants";

import { CustomRole } from "../../../../Entities";
import { Config } from "../../../../config";
import { Signale, Strings } from "../../..";
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

        const result = await CustomRole.findOne({where: {userId: ctx.userId}});
        //const result = await DB.query("SELECT roleId FROM customRoles WHERE userId = ?", [ctx.userId]);

        if (result) {
            await guild.deleteRole(result.roleId, {
                reason: Strings.commands.roles.userRemovedRole,
            });

            result.remove();
        } else {
            return ctx.editOrRespond({
                content: Strings.commands.roles.noRole,
                flags: MessageFlags.EPHEMERAL,
            });
        }
    }

    async onSuccess(ctx: Interaction.InteractionContext) {
        const guild = ctx.guilds.get("649352572464922634")!;

        Signale.success({
            prefix: "role",
            message: `Removed role for ${ctx.user.name}#${ctx.user.discriminator}`,
        });

        ctx.editOrRespond({
            content: Strings.commands.roles.roleRemoved,
            flags: MessageFlags.EPHEMERAL,
        });

        const webhooks = await guild.fetchWebhooks();
        webhooks.get(Config.webhooks.customRoles)!.execute({
            avatarUrl: ctx.me!.avatarUrl,
            embed: {
                title: "Removed custom role",
                author: {
                    name: `${ctx.user.name}#${ctx.user.discriminator}`,
                    iconUrl: ctx.user.avatarUrl,
                },
            },
        });
    }
}

export default RoleRemoveCommand;
