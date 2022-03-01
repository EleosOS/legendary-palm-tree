import { Interaction } from "detritus-client";
import { MessageComponentTypes, MessageComponentButtonStyles } from "detritus-client/lib/constants";

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

        this.ephEoR(
            ctx,
            {
                content: toggleString,
                components: [
                    {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                            /*{
                                type: MessageComponentTypes.BUTTON,
                                customId: `vcnotify:${args.user.id}`,
                                emoji: { name: "🔔" },
                                label: `Toggle VC Notification`,
                                style: MessageComponentButtonStyles.PRIMARY,
                            },*/

                            new VCNotifyToggleButtonComponent(args.user.id),
                        ],
                    },
                ],
            },
            0
        );
    }
}

export default VCNotifyContextCommand;
