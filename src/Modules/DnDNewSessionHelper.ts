import { NewSessionPrefill } from "../Entities";
import { Config, Signale } from ".";

type NewSessionPrefillOptions = {
    prefillName?: string;
    eventTitle?: string;
    sessionNumber?: number;
    schedulingThreadTitle?: string;
};

/**
 * This class contains helper functions for the new session string prefills of the DnDHelper commands.
 * Should be rewritten to support multiple guilds in the future
 */
export class DnDNewSessionHelperClass {
    public static async createPrefill(options: NewSessionPrefillOptions) {
        let newSessionPrefill = await NewSessionPrefill.findOneBy({
            prefillName: options.prefillName,
            guildId: Config.guildId
        });

        if (!newSessionPrefill) {
            // Rewrite/Refactor for multiple Prefills in the future
            newSessionPrefill = Object.assign(new NewSessionPrefill(), {
                guildId: Config.guildId,
                prefillName: "RecastCampaign",
                eventTitle: "Bob's EGGS - Session ?",
                sessionNumber: 15,
                schedulingThreadTitle: "Session ?",
            });

            await newSessionPrefill.save();
        }

        return newSessionPrefill;
    }

    public static async getPrefill(prefillName: string) {
        let newSessionPrefill = await NewSessionPrefill.findOneBy({
            prefillName,
            guildId: Config.guildId
        });

        return newSessionPrefill;
    }

    public static async increaseSessionNumber(newSessionPrefill: NewSessionPrefill) {
        newSessionPrefill.sessionNumber = newSessionPrefill.sessionNumber + 1;
        await newSessionPrefill.save();
        return newSessionPrefill;
    }

    public static async editPrefill(newSessionPrefill: NewSessionPrefill, options: NewSessionPrefillOptions) {
        newSessionPrefill = Object.assign(newSessionPrefill, options);
        await newSessionPrefill.save();
        return newSessionPrefill;
    }

    public static async deletePrefill(prefillName: string) {
        let newSessionPrefill = await NewSessionPrefill.findOneBy({
            prefillName,
            guildId: Config.guildId
        });

        if (!newSessionPrefill) {
            return null;
        }

        try {
            newSessionPrefill.remove()
            return true;
        } catch (error) {
            Signale.error({
                prefix: "DnDNewSessionHelper",
                message: error
            });

            return false;
        }
    }
}