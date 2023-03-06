import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes } from "detritus-client/lib/constants";

import { DnDNewSessionHelperClass } from "../../../../";
import { BaseCommandOption } from "../../../Basecommand";

interface NewSessionPrefillCreateArgs {
    prefillname: string;
    eventtitle: string | undefined;
    sessionnumber: string | undefined;
    schedulingthreadtitle: string | undefined;
}

class NewSessionPrefillEditCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "edit",
            description: "[SPECIAL] Edits an existing prefill",
            disableDm: true,
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
                    required: false,
                    type: ApplicationCommandOptionTypes.STRING,
                },
                {
                    name: "sessionnumber",
                    description: "The number to start counting from, will be increased with every new session",
                    required: false,
                    type: ApplicationCommandOptionTypes.NUMBER,
                },
                {
                    name: "schedulingthreadtitle",
                    //description: "Title of the scheduling thread, best with this format: \"Session ?\" (? will be replaced with sessionnumber)",
                    description: "Title of the scheduling thread",
                    required: false,
                    type: ApplicationCommandOptionTypes.STRING,
                },
            ],
        });
    }

    async run(ctx: Interaction.InteractionContext, args: NewSessionPrefillCreateArgs) {
        const result = await DnDNewSessionHelperClass.getPrefill(args.prefillname, ctx.guildId!);
        const options = {
            eventTitle: args.eventtitle,
            prefillName: args.prefillname,
            schedulingThreadTitle: args.schedulingthreadtitle,
            sessionNumber: args.sessionnumber ? Number(args.sessionnumber) : undefined
        }

        if (result) {
            await DnDNewSessionHelperClass.editPrefill(result, options);
            return this.ephEoR(ctx, `Prefill \`${result.prefillName}\` edited.`, 1);
        } else {
            return this.ephEoR(ctx, "This prefill doesn't exist.", 4)
        }
    }
}

export default NewSessionPrefillEditCommand;
