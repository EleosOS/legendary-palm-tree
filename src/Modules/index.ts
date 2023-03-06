export * from "../Entities";
export * from "../config";

export * from "./Bot";
export * from "./Signale";
export * from "./Hue";
export * from "./Webhooks";
export * from "./CronManager";
export * from "./VCNotifyManager";
export * from "./DnDNewSessionHelper";

export interface IConfig {
    token: string;
    guildId: string;
    vcNotifyPingChannelId: string;
    webhooks: {
        serverImgHue: string;
        customRoles: string;
        commandUse: string;
        guildMemberRemove: string;
        vcNotifyLog: string;
        boostLost: string;
    };
    db: {
        host: string;
        port: number;
        username: string;
        password: string;
        db: string;
    };
}
