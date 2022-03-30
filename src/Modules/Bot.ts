import { ClusterClient, InteractionCommandClient } from "detritus-client";
import { MessageComponentTypes } from "detritus-client/lib/constants";
import { Embed } from "detritus-client/lib/utils";
import { CustomRole } from "../Entities";
import { Config, Signale, Webhooks, VCNotifyManager } from "./";
import { VCNotifyToggleButtonComponent } from "./Components";

export const InteractionBot = new InteractionCommandClient(Config.token, {
    gateway: {
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_WEBHOOKS", "GUILD_VOICE_STATES"],
    },
});

// Events
InteractionBot.client.on("guildMemberRemove", async (gmr) => {
    const client = (InteractionBot.client as ClusterClient).shards.first()!;

    Webhooks.execute(Webhooks.ids.guildMemberRemove, {
        username: client.user!.name,
        avatarUrl: client.user!.avatarUrl,
        embed: {
            title: "User has left the server.",
            author: {
                name: `${gmr.user.username}#${gmr.user.discriminator}`,
                iconUrl: gmr.user.avatarUrl,
            },
        },
    });

    // Check for custom role and delete
    const result = await CustomRole.findOne({ where: { userId: gmr.userId } });

    if (result) {
        const guild = getGuild();

        await guild.deleteRole(result.roleId, {
            reason: "User removed custom role",
        });

        result.remove();

        Signale.success({
            prefix: "role",
            message: `Removed role for ${gmr.user.name}#${gmr.user.discriminator} (left guild)`,
        });

        Webhooks.execute(Webhooks.ids.customRoles, {
            avatarUrl: client.user!.avatarUrl,
            embed: {
                title: "Removed custom role (left guild)",
                author: {
                    name: `${gmr.user.name}#${gmr.user.discriminator}`,
                    iconUrl: gmr.user.avatarUrl,
                },
            },
        });
    }
});

InteractionBot.client.on("guildUpdate", (guildUpdate) => {
    if (guildUpdate.guild.id === Config.guildId) {
        checkIfGuildIconIsGif(true);

        if (guildUpdate.old) {
            if (guildUpdate.guild.premiumSubscriptionCount < guildUpdate.old.premiumSubscriptionCount) {
                Webhooks.execute(Webhooks.ids.boostLost, {
                    embed: {
                        title: "Server Boost lost",
                        color: Number(0xeb459e),
                        fields: [
                            {
                                name: "Current Boosts",
                                value: guildUpdate.guild.premiumSubscriptionCount.toString(),
                                inline: true,
                            },
                            {
                                name: "Before",
                                value: guildUpdate.old.premiumSubscriptionCount.toString(),
                                inline: true,
                            },
                            {
                                name: "Current Level",
                                value: guildUpdate.guild.premiumTier.toString(),
                            },
                        ],
                    },
                });
            }
        }
    }
});

InteractionBot.client.on("voiceStateUpdate", async (vsu) => {
    VCNotifyManager.handleVoiceStateUpdate(vsu);
});

// Helper Functions

/**
 * A shorthand to the guild
 * @returns {Guild}
 */
export function getGuild() {
    const client = (InteractionBot.client as ClusterClient).shards.first()!;
    return client.guilds.get(Config.guildId)!;
}

/**
 * Checks if the guild icon is a gif
 * @param {boolean} warn If additional warning should be sent out if the guild icon is a gif (console log, webhook)
 */
export function checkIfGuildIconIsGif(warn: boolean): boolean {
    const guild = getGuild();

    if (guild.iconUrl?.includes("gif")) {
        if (warn) {
            const client = (InteractionBot.client as ClusterClient).shards.first()!;
            const infoString = "Changing the hue of animated server icons is not supported, any hue changes will be cancelled!";

            Signale.warn({
                prefix: "hue",
                message: infoString,
            });

            Webhooks.execute(Webhooks.ids.serverImgHue, {
                avatarUrl: client.user!.avatarUrl,
                embed: {
                    title: `Hue Change Warning`,
                    description: infoString,
                    color: 0xffcb4f,
                    author: {
                        name: client.user!.name,
                        iconUrl: client.user!.avatarUrl,
                    },
                },
            });
        }

        return true;
    } else {
        return false;
    }
}
