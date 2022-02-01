// Rename config_example.ts to config.ts

export const Config = {
    token: "", // Bot Token
    guildId: "", // ID of the server on which the bot should work on
    webhooks: {
        serverImgHue: "", // ID of the webhook on which server image hue updates should be posted on
        customRoles: "", // ID of the webhook on which custom role updates should be posted on
    },
    db: {
        host: "localhost", // URL to your MySQL server
        username: "palm", // Server username
        password: "", // Server password
        db: "palmdb", // Database name
        connectionLimit: 2, // Maximum amount of connections that the bot will make to the DB at a time
    },
};
