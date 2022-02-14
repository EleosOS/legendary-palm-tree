import { ClusterClient, InteractionCommandClient, ShardClient, Utils } from "detritus-client";

import { Config, Signale, Webhooks } from "./";

export const InteractionBot = new InteractionCommandClient(Config.token, {
    gateway: {
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_WEBHOOKS"],
    },
});

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
});

InteractionBot.client.on("guildUpdate", (guildUpdate) => {
    if (guildUpdate.guild.id === Config.guildId) {
        checkIfGuildIconIsGif(true);
    }
});

export function getGuild() {
    const client = (InteractionBot.client as ClusterClient).shards.first()!;
    return client.guilds.get(Config.guildId)!;
}

export function checkIfGuildIconIsGif(warn: boolean) {
    const guild = getGuild();

    if (guild.iconUrl?.includes("gif")) {
        if (warn) {
            const client = (InteractionBot.client as ClusterClient).shards.first()!;
            const infoString = "Changing the hue of animated server icons is not supported, any hue changes will be cancelled!";

            Signale.warn({
                prefix: "hue",
                message: infoString,
            });

            Webhooks.execute(Webhooks.ids.commandUse, {
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
