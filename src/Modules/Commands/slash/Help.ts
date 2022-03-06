import { Interaction } from "detritus-client";
import { MessageComponentTypes } from "detritus-client/lib/constants";
import { Embed } from "detritus-client/lib/utils";

import { BaseSlashCommand } from "../";
import { HelpSelectMenuComponent } from "../../Components";

class HelpCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "help",
            description: "Displays info about the bot",
        });
    }

    async run(ctx: Interaction.InteractionContext) {
        return this.ephEoR(ctx, {
            components: [
                {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [new HelpSelectMenuComponent(ctx)],
                },
            ],
        });
    }
}

export default HelpCommand;
