import { ClusterClient } from "detritus-client";
import { RequestTypes } from "detritus-client-rest";
import { Config, InteractionBot, getGuild, Signale } from ".";

interface WebhookIds {
    serverImgHue: string;
    customRoles: string;
    commandUse: string;
    guildMemberRemove: string;
    vcNotifyLog: string;
    boostLost: string;
    [key: string]: string;
}

class WebhooksClass {
    ids: WebhookIds;

    constructor() {
        this.ids = {
            serverImgHue: Config.webhooks.serverImgHue,
            commandUse: Config.webhooks.commandUse,
            customRoles: Config.webhooks.customRoles,
            guildMemberRemove: Config.webhooks.guildMemberRemove,
            vcNotifyLog: Config.webhooks.vcNotifyLog,
            boostLost: Config.webhooks.boostLost,
        };
    }

    async checkWebhooks() {
        const guild = getGuild();

        if (guild.me!.canManageWebhooks) {
            const webhooks = await guild.fetchWebhooks();

            for (const key in this.ids) {
                const id = this.ids[key];

                if (!webhooks.has(id)) {
                    Signale.warn({
                        prefix: "webhooks",
                        message: `WebhookId ${id} was not found in guild.`,
                    });
                } else {
                    Signale.start({
                        prefix: "webhooks",
                        message: `${key} Webhook found: ${id}`,
                    });
                }
            }
        } else {
            Signale.warn({
                prefix: "webhooks",
                message: "The bot does not have permission to manage webhooks, it will not be able to use them!",
            });
        }
    }

    async getWebhook(id: string) {
        const guild = getGuild();
        const webhooks = await guild.fetchWebhooks();

        return webhooks.get(id);
    }

    async execute(id: string, options: RequestTypes.ExecuteWebhook) {
        const webhook = await this.getWebhook(id);

        if (!webhook) {
            return null;
        }

        return webhook.execute(options);
    }
}

export const Webhooks = new WebhooksClass();
