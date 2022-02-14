import { ClusterClient, InteractionCommandClient, ShardClient, Utils } from "detritus-client";
import { promisify } from "util";

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
        username: client.user!.username,
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

export function getGuild() {
    const client = (InteractionBot.client as ClusterClient).shards.first()!;
    return client.guilds.get(Config.guildId)!;
}
