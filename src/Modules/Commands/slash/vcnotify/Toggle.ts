import { Interaction, Structures } from "detritus-client";
import { ApplicationCommandOptionTypes, MessageComponentTypes, MessageFlags, Permissions } from "detritus-client/lib/constants";

import { VCNotifyManager } from "../../..";
import { VCNotifyToggleButtonComponent } from "../../../Components";
import { BaseCommandOption } from "../../Basecommand";

interface VCNotifyToggleCommandArgs {
    user: Structures.Member | Structures.User;
}

class VCNotifyToggleCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "toggle",
            description: "Toggles if you get notified for the specified user",
            ratelimit: {
                duration: 5000,
                limit: 1,
                type: "user",
            },
            options: [
                {
                    name: "user",
                    description: "User to look for",
                    required: true,
                    type: ApplicationCommandOptionTypes.USER,
                },
            ],
        });

        this.doNotLogSuccessWebhook = true;
    }

    async run(ctx: Interaction.InteractionContext, args: VCNotifyToggleCommandArgs) {
        const toggleString = VCNotifyManager.toggleMessage(args.user.id, ctx.userId);

        return ctx.editOrRespond({
            content: toggleString,
            flags: MessageFlags.EPHEMERAL,
            components: [
                {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [new VCNotifyToggleButtonComponent(args.user.id)],
                },
            ],
        });
    }
}

export default VCNotifyToggleCommand;
