import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes } from "detritus-client/lib/constants";

import { DnDNewSessionHelperClass } from "../../../../";
import { BaseCommandOption } from "../../../Basecommand";

interface NewSessionPrefillCreateArgs {
    prefillname: string;
    eventtitle: string;
    sessionnumber: string;
    schedulingthreadtitle: string;
}

class NewSessionPrefillCreateCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "create",
            description: "[SPECIAL] Creates a prefill to use when creating a new session",
            ratelimit: {
                duration: 5000,
                limit: 1,
                type: "user",
            },
            options: [
                {
                    name: "prefillname",
                    description: "Name of the prefill",
                    required: true,
                    type: ApplicationCommandOptionTypes.STRING,
                },
                {
                    name: "eventtitle",
                    //description: "Title of the event, best with this format: \"Campaign Name - Session ?\" (? will be replaced with sessionnumber)",
                    description: "Title of the event",
                    required: true,
                    type: ApplicationCommandOptionTypes.STRING,
                },
                {
                    name: "sessionnumber",
                    description: "The number to start counting from, will be increased with every new session",
                    required: true,
                    type: ApplicationCommandOptionTypes.NUMBER,
                },
                {
                    name: "schedulingthreadtitle",
                    //description: "Title of the scheduling thread, best with this format: \"Session ?\" (? will be replaced with sessionnumber)",
                    description: "Title of the scheduling thread",
                    required: true,
                    type: ApplicationCommandOptionTypes.STRING,
                },
            ],
        });
    }

    async run(ctx: Interaction.InteractionContext, args: NewSessionPrefillCreateArgs) {
        const result = await DnDNewSessionHelperClass.createPrefill({
            prefillName: args.prefillname,
            eventTitle: args.eventtitle,
            sessionNumber: Number(args.sessionnumber),
            schedulingThreadTitle: args.schedulingthreadtitle
        });

        if (result) {
            return this.ephEoR(ctx, `Prefill \`${args.prefillname}\` created.`, 1);
        } else {
            return this.ephEoR(ctx, "Something went wrong while creating this prefill.", 3)
        }
    }
}

export default NewSessionPrefillCreateCommand;
