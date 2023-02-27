import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes, Permissions } from "detritus-client/lib/constants";

import { Signale, Config, CustomRole, Webhooks } from "../../..";
import { BaseCommandOption, EoRStatus } from "../..";

class CustomRoleCleanCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "clean",
            description: "[ADMIN] Cleans unused roles and database entries, see help for more info",
            permissions: [Permissions.ADMINISTRATOR],
            permissionsClient: [Permissions.MANAGE_ROLES],
            ratelimit: {
                duration: 5000,
                limit: 1,
                type: "guild",
            },
        });
    }

    async run(ctx: Interaction.InteractionContext) {
        const guild = ctx.guilds.get(Config.guildId)!;
        const logDB: CustomRole[] = [];
        const logRoles: CustomRole[] = [];

        Signale.info({ prefix: "role purge", message: "Running custom role cleanup..." });
        await this.ephEoR(ctx, "Running custom role cleanup...", EoRStatus.INFO);

        const result = await CustomRole.find();

        result.forEach(async (customRole) => {
            if (!guild.roles.has(customRole.roleId)) {
                logDB.push(customRole);
                customRole.remove();
                return;
            }

            if (!guild.members.has(customRole.userId)) {
                logRoles.push(customRole);
                guild.roles.get(customRole.roleId)!.delete({ reason: `Custom Role removed by cleanup - user ${customRole.userId} no longer present` });
                customRole.remove();
            }
        });

        if (logDB.length > 0 || logRoles.length > 0) {
            return this.infoWithChanges(ctx, logDB, logRoles);
        } else {
            return this.infoNoChanges(ctx);
        }
    }

    infoNoChanges(ctx: Interaction.InteractionContext) {
        Signale.info({
            prefix: "role purge",
            message: "Role purge called but no changes made",
        });

        this.ephEoR(ctx, "DB and roles are already clean, no changes have been made.", EoRStatus.SUCCESS);

        Webhooks.execute(Webhooks.ids.customRoles, {
            avatarUrl: ctx.me!.avatarUrl,
            embed: {
                title: "Role Purge - Called but no changes made",
                author: {
                    name: `${ctx.user.name}#${ctx.user.discriminator}`,
                    iconUrl: ctx.user.avatarUrl,
                },
            },
        });
    }

    infoWithChanges(ctx: Interaction.InteractionContext, logDB: CustomRole[], logRoles: CustomRole[]) {
        let messageString = "";

        if (logDB.length > 0) {
            messageString += "✅  **These Database entries have been removed because their role is missing (probably deleted):**\n\n";

            logDB.forEach((customRole) => {
                Signale.info({
                    prefix: "role purge",
                    message: `Removed DB Entry, role no longer present - userID: <@!${customRole.userId}> | roleID: ${customRole.roleId}`,
                });

                messageString += `"${customRole.roleId}" owned by <@!${customRole.userId}>\n`;
            });
        }

        if (logRoles.length > 0) {
            messageString += "\n**These Roles have been deleted because their user has left the server:**\n\n";

            logRoles.forEach((customRole) => {
                Signale.info({
                    prefix: "role purge",
                    message: `Removed Custom Role and DB Entry, user no longer present - userID: <@!${customRole.userId}> | roleID: ${customRole.roleId}`,
                });

                messageString += `"${customRole.roleId}" owned by <@!{${customRole.userId}}>\n`;
            });
        }

        this.ephEoR(ctx, messageString, EoRStatus.NONE);

        Webhooks.execute(Webhooks.ids.customRoles, {
            avatarUrl: ctx.me!.avatarUrl,
            embed: {
                title: "Role Purge - Results",
                author: {
                    name: `${ctx.user.name}#${ctx.user.discriminator}`,
                    iconUrl: ctx.user.avatarUrl,
                },
                description: messageString,
            },
        });
    }
}

export default CustomRoleCleanCommand;
