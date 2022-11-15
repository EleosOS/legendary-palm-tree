import { ClusterClient } from "detritus-client";
import Jimp from "jimp";
import { InteractionBot, Signale, Config, Hue, checkIfGuildIconIsGif, Webhooks, CronManager } from "./";

export async function changeServerIconHue(amount: number) {
    const client = (InteractionBot.client as ClusterClient).shards.first()!;
    const guild = client.guilds.get(Config.guildId)!;
    let hueBefore;

    // Check for guild image
    if (guild.iconUrl === null || checkIfGuildIconIsGif(false)) {
        Signale.warn({
            prefix: "hue",
            message: "The server does not have an icon to change the hue of, or an animated icon.",
        });

        return false;
    }

    // Save new hue
    let hue = await Hue.findOneBy({
        id: 1,
    });

    if (hue) {
        hueBefore = hue.currentHue;
        hue.currentHue += amount;

        // I'm not even going to pretend I know how this line works, all I know is it normalizes the hue degree.
        hue.currentHue = ((hue.currentHue % 360) + 360) % 360;

        try {
            await hue.save();
        } catch (err) {
            Signale.error({
                prefix: "hue",
                err: err,
            });
        }
    } else {
        hue = new Hue();
        hue.currentHue = amount;
        hue.stepSize = 10;
        hue.cronExpression = "0 0 * * *";

        hue.currentHue = ((hue.currentHue % 360) + 360) % 360;

        try {
            await hue.save();
        } catch (err) {
            Signale.error({
                prefix: "hue",
                err: err,
            });
        }

        Signale.warn({
            prefix: "hue",
            message: `No hue existed in the DB. A new hue for the server was saved with id: ${hue.id}, hue: ${hue.currentHue}, stepSize: 10, cronExpression: "0 0 * * *" (At 12:00 AM) - you can edit these values with the /hue commands.`,
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
    Webhooks.execute(Webhooks.ids.serverImgHue, {
        avatarUrl: client.user!.avatarUrl,
        embed: {
            title: `Icon hue has been changed`,
            author: {
                name: client.user!.username,
                iconUrl: client.user!.avatarUrl,
            },
            fields: [
                {
                    name: "New",
                    value: `${hue.currentHue}°`,
                    inline: true,
                },
                {
                    name: "Old",
                    value: `${hueBefore}°`,
                    inline: true,
                },
            ],
            image: {
                url: guild.iconUrl!,
            },
        },
    });

    Signale.note({
        prefix: "hue",
        message: `Guild icon hue has been changed to ${hue.currentHue}° (was ${hueBefore}°)`,
    });

    return true;
}

export function scheduleStartupHueChange(cronExpression: string, stepSize: number) {
    CronManager.removeTask("hueChange");

    CronManager.addTask("hueChange", cronExpression, () => {
        changeServerIconHue(stepSize);
    });

    Signale.info({
        prefix: "hue",
        message: `Hue change scheduled at "${cronExpression}", stepSize ${stepSize}`,
    });
}
