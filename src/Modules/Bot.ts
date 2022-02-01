import { ClusterClient, InteractionCommandClient } from "detritus-client";
import Jimp from "jimp";

import { Hue } from "../Entities/hue";
import { Config } from "../config";
import { Signale } from "./";

export const InteractionBot = new InteractionCommandClient(Config.token, {
    gateway: {
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_WEBHOOKS"],
    },
});

export async function changeRecringeHue(amount: number) {
    const client = (InteractionBot.client as ClusterClient).shards.first()!;
    const guild = client.guilds.get(Config.guildId)!;

    // Check for guild image
    if (guild.iconUrl === null) {
        Signale.warn({
            prefix: "hue",
            message: "Guild does not have an icon to change the hue of.",
        });

        return false;
    }

    // Save new hue
    let result = await Hue.findOne(1);

    if (result) {
        result.currentHue += amount;

        if (result.currentHue >= 360) {
            result.currentHue -= 360;
        }

        try {
            await result.save();
        } catch (err) {
            Signale.error({
                prefix: "hue",
                err: err,
            });
        }
    } else {
        result = new Hue();
        result.currentHue = 10;

        try {
            await result.save();
        } catch (err) {
            Signale.error({
                prefix: "hue",
                err: err,
            });
        }

        Signale.warn({
            prefix: "hue",
            message: `No hue existed in the DB. A new hue for the server was saved as 10 (id: ${result.id}), you can edit this with the command /hue override.`,
        });
    }

    // Change guild image
    // TODO: Finally make this work with gifs
    const image = await Jimp.read(guild.iconUrl);
    image.color([{ apply: "hue", params: [amount] }]);

    await guild.edit({
        icon: await image.getBufferAsync("image/png"),
    });

    // Notify
    (await guild.fetchWebhooks()).get(Config.webhooks.serverImgHue)!.execute({
        avatarUrl: client.user!.avatarUrl,
        embed: {
            title: `Hue has been changed. (${result.currentHue})`,
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
        message: `Guild icon hue has been changed. (${result.currentHue})`,
    });

    return true;
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
