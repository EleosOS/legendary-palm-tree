import { ClusterClient } from "detritus-client";
import Jimp from "jimp";
import cron, { ScheduledTask } from "node-cron";
import { InteractionBot, Signale, Config, Hue } from "./";

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

        // I'm not even going to pretend I know how this line works, all I know is it normalizes the hue degree.
        result.currentHue = ((result.currentHue % 360) + 360) % 360;

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

export function scheduleHueChange(cronExpression: string) {
    if (!cron.validate(cronExpression)) {
        return Signale.fatal({
            prefix: "hue",
            message: "scheduleHueChange was called with an invalid cron expression, no hue change has been (re-)scheduled.",
        });
    }

    const tasks = cron.getTasks();

    if (tasks[0]) {
        tasks[0].stop();
        delete tasks[0];
    }

    cron.schedule(cronExpression, () => {
        changeServerIconHue(10);
    });

    Signale.info({
        prefix: "hue",
        message: `Hue change scheduled`,
    });
}
