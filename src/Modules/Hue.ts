import { ClusterClient } from "detritus-client";
import Jimp from "jimp";
import { InteractionBot, Signale } from ".";
import { Config } from "../config";
import { Hue } from "../Entities";

export async function changeServerIconHue(amount: number) {
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
            message: `No hue existed in the DB. A new hue for the server was saved as 10 (id: ${result.id}), you can edit this with the command /hue overwrite.`,
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

export function scheduleHueChange() {
    Signale.note({
        prefix: "hue",
        message: `Scheduling hue change`,
    });

    let hueTrigger = new Date();
    const now = new Date();

    hueTrigger.setDate(now.getDate() + 1);
    hueTrigger.setHours(0);
    hueTrigger.setMinutes(0);
    hueTrigger.setSeconds(0);
    hueTrigger.setMilliseconds(0);

    setTimeout(() => {
        void changeServerIconHue(10);
        setInterval(() => void changeServerIconHue(10), 86400000);
    }, hueTrigger.getTime() - now.getTime());
}
