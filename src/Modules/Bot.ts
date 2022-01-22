import { ClusterClient, CommandClient, Constants, InteractionCommandClient, ShardClient } from "detritus-client";
import Jimp from "jimp";
import { DB } from "./";
import { Config } from "../config";
import { Signale, Strings } from "./";
import { PingCommand } from "./Commands/slash/Ping";
import { RowDataPacket } from "mysql2";
import { ApplicationCommandTypes } from "detritus-client/lib/constants";

export const cluster = new ClusterClient(Config.token, {
    gateway: {
        intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_WEBHOOKS", "DIRECT_MESSAGES"],
        presence: {
            activity: {
                name: "prefix: os",
                type: Constants.ActivityTypes.CUSTOM_STATUS,
                emoji: {
                    name: ":white_circle:",
                    animated: false,
                    id: null,
                },
            },
        },
    },
});

export const Bot = new CommandClient(cluster, {
    prefixes: ["os", "i cast"],
    mentionsEnabled: true,
});

export const InteractionBot = new InteractionCommandClient(cluster);

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

//Bot.addMultiple(Commands);
InteractionBot.addMultiple([new PingCommand()]);

/*InteractionBot.add({
    guildIds: ["649352572464922634"],
    name: "pingo",
    type: ApplicationCommandTypes.MESSAGE,
    run: async (ctx, args) => {
        let language = "js";
        let message: unknown;
        try {
            message = ctx;
            if (typeof message === "object") {
                message = JSON.stringify(message, null, 2);
                language = "json";
            }
        } catch (error: any) {
            message = error ? error.stack || error.message : error;
        }

        const max = 1990 - language.length;
        return ctx.editOrRespond(["```" + language, String(message).slice(0, max), "```"].join("\n"));
    },
});*/

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

InteractionBot.commands.forEach((command) => {
    Signale.info({
        prefix: "startup",
        message: "InteractionCommand found:",
        suffix: command.name,
    });
});
