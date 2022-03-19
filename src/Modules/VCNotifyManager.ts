import { ClusterClient, GatewayClientEvents } from "detritus-client";
import { MessageComponentTypes } from "detritus-client/lib/constants";
import { User } from "detritus-client/lib/structures";
import { Embed } from "detritus-client/lib/utils";
import { Config, getGuild, InteractionBot, Signale, Webhooks } from ".";
import { VCNotifyToggleButtonComponent } from "./Components";

/**
 * @key userId of the user to watch out for
 * @value userId of the user that should be notified
 */
class VCNotifyManagerClass {
    watchers: string[][];

    constructor() {
        this.watchers = [];
    }

    /**
     * Toggles whether or not the user of notifiedId should recieve a notification when watchedId join a VC
     *
     * @param watchedId userId of the person to watch out for
     * @param notifiedId userId of the user that should be notified
     * @return True if user gets notified, False if not
     */
    toggle(watchedId: string, notifiedId: string): boolean {
        let vswIndex: number | undefined;

        for (var i = this.watchers.length; i--; ) {
            const [key, value] = this.watchers[i];

            if (key === watchedId && value === notifiedId) {
                vswIndex = i;
            }
        }

        // If a user is already watching for this person, disable the notification
        if (typeof vswIndex !== "undefined") {
            this.watchers.splice(vswIndex, 1);

            return false;
        } else {
            this.watchers.push([watchedId, notifiedId]);

            return true;
        }
    }

    /**
     * Calls VCNotifyManagerClass.toggle() and returns a string depending on the outcome
     *
     * @param watchedId userId of the person to watch out for
     * @param notifiedId userId of the user that should be notified
     * @return string
     */
    toggleMessage(watchedId: string, notifiedId: string) {
        const toggle = VCNotifyManager.toggle(watchedId, notifiedId);

        if (toggle) {
            return `🔔 **You will recieve a ping when <@${watchedId}> joins a voice channel.**`;
        } else {
            return `🔕 **You will no longer be notified when <@${watchedId}> joins a voice channel.**`;
        }
    }

    logToggle(watched: User, notified: User, active: boolean) {
        Signale.info({
            prefix: "vcNotify",
            message: `${notified.name}#${notified.discriminator} - VC Notification toggled to "${active}" for ${watched.name}#${watched.discriminator}`,
        });

        Webhooks.execute(Webhooks.ids.vcNotifyLog, {
            avatarUrl: watched.client.user?.avatarUrl,
            embed: {
                title: `VC Notification Toggled`,
                author: {
                    name: `${notified.username}#${notified.discriminator}`,
                    iconUrl: notified.avatarUrl,
                },
                fields: [
                    {
                        name: "Active",
                        value: String(active),
                        inline: true,
                    },
                    {
                        name: "Watching for",
                        value: `<@${watched.id}>`,
                        inline: true,
                    },
                ],
            },
        });
    }

    /**
     * Resolves everything related to VC notifications with the given VoiceStateUpdate event
     *
     * @param {GatewayClientEvents.VoiceStateUpdate} vsu
     * @returns void
     */
    handleVoiceStateUpdate(vsu: GatewayClientEvents.VoiceStateUpdate) {
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
    }
}

export const VCNotifyManager = new VCNotifyManagerClass();
