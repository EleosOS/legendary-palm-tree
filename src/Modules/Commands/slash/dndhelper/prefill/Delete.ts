import { Interaction } from "detritus-client";
import { ApplicationCommandOptionTypes } from "detritus-client/lib/constants";

import { DnDNewSessionHelperClass } from "../../../../";
import { BaseCommandOption } from "../../../Basecommand";

interface NewSessionPrefillDeleteArgs {
    prefillname: string;
}

class NewSessionPrefillDeleteCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "delete",
            description: "[SPECIAL] Deletes a prefill",
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
            ],
        });
    }

    async run(ctx: Interaction.InteractionContext, args: NewSessionPrefillDeleteArgs) {
        const result = await DnDNewSessionHelperClass.deletePrefill(args.prefillname, ctx.guildId!);

        if (result === true) {
            return this.ephEoR(ctx, `Prefill \`${args.prefillname}\` deleted.`, 1);
        } else if (result === false) {
            return this.ephEoR(ctx, "Something went wrong while deleting this prefill.", 3)
        } else {
            return this.ephEoR(ctx, "This prefill doesn't exist.", 4)
        }
    }
}

export default NewSessionPrefillDeleteCommand;
