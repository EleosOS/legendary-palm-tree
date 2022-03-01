import { Interaction } from "detritus-client";

import { VCNotifyManager } from "../../..";
import { BaseCommandOption } from "../../Basecommand";

class VCNotifyListCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "list",
            description: "Lists all the users that you'll be notified for",
        });
    }

    async run(ctx: Interaction.InteractionContext) {
        let message = "**You will recieve a ping when any of these users join a voice channel:** \n\n";

        VCNotifyManager.watchers.forEach(([watchedId, notifiedId]) => {
            if (ctx.userId === notifiedId) {
                message += `<@${watchedId}>\n`;
            }
        });

        return this.ephEoR(ctx, message, 0);
    }
}

export default VCNotifyListCommand;
