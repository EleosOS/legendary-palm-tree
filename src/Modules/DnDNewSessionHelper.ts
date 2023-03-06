import { NewSessionPrefill } from "../Entities";
import { Config, Signale } from ".";
import { InteractionDataApplicationCommand } from "detritus-client/lib/structures";

interface NewSessionPrefillOptions {
    prefillName: string | undefined;
    eventTitle: string | undefined;
    sessionNumber: number | undefined;
    schedulingThreadTitle: string | undefined;
};

/**
 * This class contains helper functions for the new session string prefills of the DnDHelper commands.
 */
export class DnDNewSessionHelperClass {
    public static async createPrefill(options: NewSessionPrefillOptions) {
        let newSessionPrefill = await NewSessionPrefill.findOneBy({
            prefillName: options.prefillName,
            guildId: Config.guildId
        });

        if (newSessionPrefill) {
            return false;
        } else {
            // Rewrite/Refactor guildId for multiple Prefills in the future
            newSessionPrefill = Object.assign(new NewSessionPrefill(), {
                guildId: Config.guildId,
                prefillName: options.prefillName,
                eventTitle: options.eventTitle,
                sessionNumber: options.sessionNumber,
                schedulingThreadTitle: options.schedulingThreadTitle,
            });

            await newSessionPrefill.save();
            return newSessionPrefill
        }
    }

    public static async getPrefill(prefillName: string, guildId: string) {
        let newSessionPrefill = await NewSessionPrefill.findOneBy({
            prefillName,
            guildId: guildId
        });

        return newSessionPrefill ?? undefined;
    }

    public static async increaseSessionNumber(newSessionPrefill: NewSessionPrefill) {
        /*if (typeof newSessionPrefill === "string") {
            let temp = await this.getPrefill(newSessionPrefill);

            if (temp) {
                newSessionPrefill = temp;
            } else {
                return false;
            }
        }*/

        newSessionPrefill.sessionNumber = newSessionPrefill.sessionNumber + 1;
        await newSessionPrefill.save();
        return newSessionPrefill;
    }

    public static async editPrefill(newSessionPrefill: NewSessionPrefill, options: NewSessionPrefillOptions) {
        const {eventTitle, prefillName, schedulingThreadTitle, sessionNumber} = options;
        if (eventTitle) {
            newSessionPrefill.eventTitle = eventTitle;
        }
        
        if (prefillName) {
            newSessionPrefill.prefillName = prefillName;
        }

        if (schedulingThreadTitle) {
            newSessionPrefill.schedulingThreadTitle = schedulingThreadTitle;
        }

        if (sessionNumber) {
            newSessionPrefill.sessionNumber = sessionNumber;
        }

        await newSessionPrefill.save();
        return newSessionPrefill;
    }

    public static async deletePrefill(prefillName: string, guildId: string) {
        let newSessionPrefill = await NewSessionPrefill.findOneBy({
            prefillName,
            guildId: guildId
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

    /*public static async handlePrefillAutocomplete(data: InteractionDataApplicationCommand) {
        // search for prefill using data.options?
    }*/
}