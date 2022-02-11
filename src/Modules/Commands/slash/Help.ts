/*import { Interaction } from "detritus-client";
import { Embed } from "detritus-client/lib/utils";

import { BaseSlashCommand } from "../";

const embedDescription = `
os is a bot developed by <@249880389160665089> for Recringe. It's main purpose (at the moment) is to allow you to create your own custom role. To get started, take a look at \`/role create\`.
\n**Changes in version 1.1:**
\nAll important info on commands has been moved into the slash command UI.
\nAll commands have been reworked into slash commands, that means the prefix \`os\` has also been retired. Slash commands are available in every channel, even if the bot can't see it.
\nMost, if not all command responses are now "ephemeral", they will only show up for you personally.
\n\`role\` - Role creation/editing has been moved into the subcommand \`/role create\`.
\n\`role info\` - Has been renamed to \`/role inspect\`. You can now inspect the role of every user, not just your own.
\nEnjoy!`;

class HelpCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "help",
            description: "Displays info about the bot.",
        });
    }

    async run(ctx: Interaction.InteractionContext) {
        const embed = new Embed({
            author: {
                icon_url: ctx.me!.avatarUrl,
                name: "os",
            },
            color: Number("0xffffff"),
            title: "About os",
            description: embedDescription,
        });

        return this.ephEoR(ctx, { embed });
    }
}

export default HelpCommand;
*/
