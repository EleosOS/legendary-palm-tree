import { CommandClient, Constants, ShardClient } from "detritus-client";
import Jimp from "jimp";
import { DB } from "./";
import { Config } from "../config";
import { Signale, Strings } from "./";
import Commands from "./Commands";
import { RowDataPacket } from "mysql2";

export const Bot = new CommandClient(Config.token, {
    prefixes: ["os", "i cast"],
    useClusterClient: false,
    gateway: {
        intents: [
            "GUILDS",
            "GUILD_MESSAGES",
            "GUILD_MEMBERS",
            "GUILD_WEBHOOKS",
            "DIRECT_MESSAGES",
        ],
        presence: {
            activity: {
                name: "prefix: os",
                type: 0,
                /*type: 4,
				emoji: {
					name: ':white_circle:',
					animated: false,
					id: null
				}*/
            },
        },
    },
});

Bot.on(Constants.ClientEvents.COMMAND_FAIL, (e) => {
    Signale.fatal({ prefix: e.command.name + " - Fail", message: e.error });
    void e.context.editOrReply(Strings.bot.error.replace("?", e.error.message));
});

Bot.on(Constants.ClientEvents.COMMAND_ERROR, (e) => {
    if (e.command.disableDm) {
        return;
    }

    Signale.error({ prefix: e.command.name + " - Error", message: e.error });
    void e.context.editOrReply(Strings.bot.error.replace("?", e.error.message));
});

Bot.on(Constants.ClientEvents.COMMAND_RATELIMIT, (r) => {
    Signale.warn({
        prefix: "ratelimit",
        message: `${r.context.user.name}#${r.context.user.discriminator} has reached ratelimit of ${r.command.name}.`,
    });
    void r.context.editOrReply(Strings.bot.ratelimitReached);
});

export async function changeRecringeHue(amount: number) {
    const client = Bot.client as ShardClient;
    const guild = client.guilds.get("649352572464922634")!;
    const image = await Jimp.read(guild.iconUrl!);
    let currentHue: number;

    image.color([{ apply: "hue", params: [amount] }]);

    await guild!.edit({
        icon: await image.getBufferAsync("image/png"),
    });

    const result = await DB.query("SELECT currentHue from hue WHERE id = 1;");

    if (
        result &&
        (result[0] as RowDataPacket[]).length > 0 &&
        (result[0] as any)[0].currentHue != undefined
    ) {
        currentHue = (result[0] as any)[0].currentHue;

        currentHue += amount;

        if (currentHue >= 360) {
            currentHue -= 360;
        }

        await DB.query("UPDATE hue SET currentHue = ? WHERE id = 1", [
            currentHue.toString(),
        ]);
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

Bot.addMultiple(Commands);

const commandsSorted = Bot.commands.slice().sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
        return -1;
    } else if (nameA > nameB) {
        return 1;
    } else {
        return 0;
    }
});

commandsSorted.forEach((command) => {
    Signale.info({
        prefix: "startup",
        message: "Command found:",
        suffix: command.name,
    });
});
