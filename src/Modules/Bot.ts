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
    }
});

// VCNotify
InteractionBot.client.on("voiceStateUpdate", async (vsu) => {
    if (!vsu.joinedChannel || VCNotifyManager.watchers.length === 0) return;

    // Get the channel to post the notification in, if it's unavailable don't continue
    let notifyChannel = getGuild().channels.get(Config.vcNotifyPingChannelId);
    if (!notifyChannel) {
        Signale.warn({
            prefix: "vcnotify",
            message: "The specified channel for VC notifications couldn't be accessed! No notifications were processed.",
        });

        return;
    }

    // Set up an embed for logging
    const embed = new Embed({
        title: "VC Notification Triggered",
        fields: [
            {
                name: "Triggered by",
                value: `<@${vsu.voiceState.userId}>`,
                inline: true,
            },
        ],
    });

    // Loop through all waiting notifications, remove any that match and generate the first part of the message
    let notifyString = "";
    let logUserListString = "";
    let j = 0;

    for (var i = VCNotifyManager.watchers.length; i--; ) {
        const [watchedId, notifiedId] = VCNotifyManager.watchers[i];

        if (vsu.voiceState.userId === watchedId) {
            j++;
            notifyString += `<@${notifiedId}> `;
            logUserListString += `<@${notifiedId}>\n`;
            VCNotifyManager.watchers.splice(i, 1);
        }
    }

    // Nobody wanted to be notified for that user
    if (j === 0) return;

    // If more than two people were waiting, format notifyString differently
    if (j <= 2) {
        notifyString += "- ";
    } else {
        notifyString += "\n\n";
    }

    notifyString += `<@${vsu.voiceState.userId}> has joined <#${vsu.voiceState.channelId}>. (You will not be notified again.)`;

    notifyChannel.createMessage({
        content: notifyString,
        components: [
            {
                type: MessageComponentTypes.ACTION_ROW,
                components: [new VCNotifyToggleButtonComponent(vsu.voiceState.userId, true)],
            },
        ],
    });

    // Logging
    Signale.info({
        prefix: "vcnotify",
        message: `VC Notification triggered by ${vsu.voiceState.member!.name}#${vsu.voiceState.member!.discriminator}`,
    });

    const client = (InteractionBot.client as ClusterClient).shards.first()!;

    embed.addField("Notified Users", logUserListString, true);

    Webhooks.execute(Webhooks.ids.vcNotifyLog, {
        avatarUrl: client.user!.avatarUrl,
        embed,
    });
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
