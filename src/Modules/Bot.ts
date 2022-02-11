import { InteractionCommandClient } from "detritus-client";

import { Config } from "./";

export const InteractionBot = new InteractionCommandClient(Config.token, {
    gateway: {
        intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_WEBHOOKS"],
    },
});
