import { IConfig } from "./Modules";
import fs from "node:fs";

const tokenFilePath = process.env.DISCORD_TOKEN_LOCATION ?? "../discord_token.txt";
let token = "";

try {
    token = fs.readFileSync(tokenFilePath, "utf-8").trim();
} catch (error) {
    console.error(`Error reading token file: ${error}`);
}

export const Config: IConfig = {
    token,
    guildId: process.env.GUILD_ID ?? "",
    vcNotifyPingChannelId: process.env.VC_NOTIFY_PING_CHANNEL_ID ?? "",
    webhooks: {
        serverImgHue: process.env.WEBHOOK_SERVER_IMAGE_HUE ?? "",
        customRoles: process.env.WEBHOOK_CUSTOM_ROLES ?? "",
        commandUse: process.env.WEBHOOK_COMMAND_USE ?? "",
        guildMemberRemove: process.env.WEBHOOK_GUILD_MEMBER_REMOVE ?? "",
        vcNotifyLog: process.env.WEBHOOK_VC_NOTIFY_LOG ?? "",
        boostLost: process.env.WEBHOOK_BOOST_LOST ?? "",
    },
    db: {
        host: process.env.DB_HOST_URI ?? "",
        port: Number(process.env.DB_PORT),
        username: process.env.DB_NAME ?? "",
        password: process.env.DB_USERNAME ?? "",
        db: process.env.DB_PASSWORD ?? "",
    },
};
