import { IConfig } from "./Modules/Config";

// Rename config_example.ts to config.ts (not to be confused with src/Modules/Config.ts)
export const Config: IConfig = {
    token: "", // Bot Token
    guildId: "", // ID of the server on which the bot should work on
    webhooks: {
        serverImgHue: "", // ID of the webhook on which server image hue updates should be posted on
        customRoles: "", // ID of the webhook on which custom role updates should be posted on
    },
    db: {
        host: "localhost", // URL to your MySQL server
        port: 3306, // Port of your MySQL server
        username: "palm", // Server username
        password: "", // Server password
        db: "palmdb", // Database name
    },
    // The behavior of the bot can be changed dynamically with commands
    // These changes will only be in effect until the bot is restarted, but they can be made permanent here
    behavior: {
        shouldIconHueChange: true, // If everything related to changing the server icon hue should be enabled
        shouldEnableCustomRoles: true, // If custom role commands should be enabled (disables /role create, /role remove)
        shouldIconHueAutomaticallyChange: true, // If the bot should automatically change the server icon hue - this can be disabled without disabling commands like /hue change
        iconHueStep: 10, // How much the hue should automatically change
        // Commands disabled here will not be uploaded to discord
        enabledCommands: {
            help: true,
            ping: true,
            purge: true,
            role: {
                inspect: true, // This will be disabled with shouldEnableCustomRoles, but can also be disabled seperately
            },
        },
    },
};
