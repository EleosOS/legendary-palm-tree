import { User } from "detritus-client/lib/structures";
import { Signale, Webhooks } from ".";

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
}

export const VCNotifyManager = new VCNotifyManagerClass();
