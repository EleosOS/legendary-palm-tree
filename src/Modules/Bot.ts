import { ClusterClient, CommandClient, Constants, InteractionCommandClient, ShardClient } from "detritus-client";
import Jimp from "jimp";
import { DB } from "./";
import { Config } from "../config";
import { Signale, Strings } from "./";
import { RowDataPacket } from "mysql2";

export const InteractionBot = new InteractionCommandClient(Config.token, {
    gateway: {
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_WEBHOOKS"],
    },
});

export async function changeRecringeHue(amount: number) {
    const client = (InteractionBot.client as ClusterClient).shards.first()!;
    const guild = client.guilds.get(Config.guildId)!;
    const image = await Jimp.read(guild.iconUrl!);
    let currentHue: number;

    image.color([{ apply: "hue", params: [amount] }]);

    await guild!.edit({
        icon: await image.getBufferAsync("image/png"),
    });

    const result = await DB.query("SELECT currentHue from hue WHERE id = 1;");

    if (result && (result[0] as RowDataPacket[]).length > 0 && (result[0] as any)[0].currentHue != undefined) {
        currentHue = (result[0] as any)[0].currentHue;

        currentHue += amount;

        if (currentHue >= 360) {
            currentHue -= 360;
        }

        await DB.query("UPDATE hue SET currentHue = ? WHERE id = 1", [currentHue.toString()]);
    } else {
        Signale.error({
            prefix: "hue",
            message: "changeRecringeHue failed at DB query!",
        });

        return;
    }

    (await guild.fetchWebhooks()).get(Config.webhooks.serverImgHue)!.execute({
        avatarUrl: client.user!.avatarUrl,
        embed: {
            title: `Hue has been changed. (${currentHue})`,
            author: {
                name: "os",
                iconUrl: client.user!.avatarUrl,
            },
            image: {
                url: guild.iconUrl!,
            },
        },
    });

    Signale.note({
        prefix: "hue",
        message: `Hue has been changed. (${currentHue})`,
    });
}

/*const commandsSorted = Bot.commands.slice().sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
        return -1;
    } else if (nameA > nameB) {
        return 1;
    } else {
        return 0;
    }
});*/
