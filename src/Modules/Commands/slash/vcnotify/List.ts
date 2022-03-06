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
        let i = 0;

        VCNotifyManager.watchers.forEach(([watchedId, notifiedId]) => {
            if (ctx.userId === notifiedId) {
                i++;
                message += `<@${watchedId}>\n`;
            }
        });

        if (i === 0) {
            return this.ephEoR(ctx, '⚠ You are currently not waiting for any users. Right click a user and under "Apps", select "Toggle VC Notification" or use the command `/vcnotify toggle (user)` to be notified when the selected user joins a voice channel.', 0);
        } else {
            return this.ephEoR(ctx, message, 0);
        }
    }
}

export default VCNotifyListCommand;
