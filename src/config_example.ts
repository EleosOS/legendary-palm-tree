// Rename config_example.ts to config.ts

export const Config = {
    token: "", // Bot Token
    guildId: "", // ID of the server on which the bot should work on
    webhooks: {
        serverImgHue: "", // ID of the webhook on which server image hue updates should be posted on
        customRoles: "", // ID of the webhook on which custom role updates should be posted on
        guildMemberRemove: "", // ID of the webhook on which a message should be posted when a member leaves
    },
    db: {
        host: "localhost", // URL to your MySQL server
        port: 3306, // Port of your MySQL server
        username: "palm", // Server username
        password: "", // Server password
        db: "palmdb", // Database name
    },
};
