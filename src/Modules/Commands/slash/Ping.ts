import { Interaction } from "detritus-client";
import { MessageFlags } from "detritus-client/lib/constants";

import { BaseSlashCommand } from "../Basecommand";

class PingCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "ping",
            description: "Launches a nuke",
        });
    }

    async run(ctx: Interaction.InteractionContext) {
        const { gateway, rest } = await ctx.client.ping();

        return this.ephEoR(ctx, `Pong! - Gateway: \`${gateway}ms\` Rest: \`${rest}ms\``, 0);
    }
}

export default PingCommand;
