import { Interaction } from "detritus-client";
import { NewSessionPrefill } from "../../../../../Entities";

import { BaseCommandOption } from "../../../Basecommand";

class NewSessionPrefillListCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "list",
            description: "[SPECIAL] Lists all prefills of this guild",
            ratelimit: {
                duration: 5000,
                limit: 1,
                type: "user",
            }
        });
    }

    async run(ctx: Interaction.InteractionContext) {
        let resultString = "These prefills are currently saved for this server:\n";
        const result = await NewSessionPrefill.find({
            where: {
                guildId: ctx.guildId
            }
        });

        if (result.length === 0) {
            resultString = "⚠️ **This server doesn't have any prefills.**";
        } else {
            result.forEach((value) => {
                resultString += "\n" + value.prefillName;
            });
        }

        return this.ephEoR(ctx, resultString, 0);
    }
}

export default NewSessionPrefillListCommand;
