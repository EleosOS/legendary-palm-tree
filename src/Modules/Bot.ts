import { ClusterClient, InteractionCommandClient } from "detritus-client";

import { Config } from "./";

export const InteractionBot = new InteractionCommandClient(Config.token, {
    gateway: {
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_WEBHOOKS"],
    },
});

InteractionBot.client.on("guildMemberRemove", async (gmr) => {
    const client = (InteractionBot.client as ClusterClient).shards.first()!;
    const guild = client.guilds.get(Config.guildId)!;

    (await guild.fetchWebhooks()).get(Config.webhooks.guildMemberRemove)!.execute({
        avatarUrl: client.user!.avatarUrl,
        embed: {
            title: `${gmr.user.username}#${gmr.user.discriminator} has left the server.`,
            author: {
                name: client.user!.name,
                iconUrl: client.user!.avatarUrl,
            },
            thumbnail: {
                url: gmr.user.avatarUrl,
            },
        },
    });
});
