import { ApplicationCommandTypes } from "detritus-client/lib/constants";
import { Bot, cluster, InteractionBot, changeRecringeHue } from "./Modules/Bot";
import { Signale } from "./Modules/Signale";
import { Utils, Constants } from "detritus-client";

void (async () => {
    await cluster.run();
    await Bot.run();
    await InteractionBot.run();

    Signale.start({ prefix: "startup", message: "Bot ready" });

    const hueTrigger = new Date();
    const now = new Date();

    hueTrigger.setDate(now.getDate() + 1);
    hueTrigger.setHours(0);
    hueTrigger.setMinutes(0);
    hueTrigger.setSeconds(0);
    hueTrigger.setMilliseconds(0);

    setTimeout(() => {
        void changeRecringeHue(10);
        setInterval(() => void changeRecringeHue(10), 86400000);
    }, hueTrigger.getTime() - now.getTime());
})();
