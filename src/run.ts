import "reflect-metadata";
import { createConnection } from "typeorm";

import { CustomRole, Hue } from "./Entities";

import { Config } from "./config";
import { InteractionBot, Signale, scheduleHueChange } from "./Modules";
import Commands from "./Modules/Commands";

void (async () => {
    await createConnection({
        type: "mysql",
        host: Config.db.host,
        port: Config.db.port,
        username: Config.db.username,
        password: Config.db.password,
        database: Config.db.db,
        entities: [CustomRole, Hue],
    });

    InteractionBot.addMultiple(Commands);

    InteractionBot.commands.forEach((command) => {
        Signale.info({
            prefix: "startup",
            message: "InteractionCommand found:",
            suffix: command.name,
        });
    });

    await InteractionBot.run();

    // Clean up guild slash commands
    //await InteractionBot.rest.bulkOverwriteApplicationGuildCommands(InteractionBot.client.applicationId, Config.guildId, []);

    // Clean up global slash commands
    //await InteractionBot.rest.bulkOverwriteApplicationCommands(InteractionBot.client.applicationId, []);

    // Force the upload of known slash commands
    //await InteractionBot.checkAndUploadCommands(true);

    Signale.start({ prefix: "startup", message: "Bot ready" });

    // Check for guild
    try {
        await InteractionBot.rest.fetchGuild(Config.guildId);
    } catch (err) {
        Signale.fatal({
            prefix: "startup",
            message: "Specified guild could not be found! guildId in config.ts might be incorrect, the bot was not added to the guild, or Discord could be having an outage.",
        });

        Signale.fatal({
            prefix: "startup",
            message: "Exiting...",
        });

        throw new Error();
    }

    scheduleHueChange();
})();
