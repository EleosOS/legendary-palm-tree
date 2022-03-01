import { Interaction } from "detritus-client";
import { MessageComponentTypes, MessageFlags } from "detritus-client/lib/constants";

import { BaseContextMenuUserCommand, ContextMenuUserArgs } from "..";
import { VCNotifyManager } from "../..";
import { VCNotifyToggleButtonComponent } from "../../Components";

class VCNotifyContextCommand extends BaseContextMenuUserCommand {
    constructor() {
        super({
            name: "Toggle VC Notification",
        });
    }

    async run(ctx: Interaction.InteractionContext, args: ContextMenuUserArgs) {
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

export default VCNotifyContextCommand;
