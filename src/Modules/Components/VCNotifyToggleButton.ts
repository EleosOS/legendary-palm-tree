import { InteractionCallbackTypes, MessageComponentButtonStyles, MessageFlags } from "detritus-client/lib/constants";
import { InteractionEditOrRespond } from "detritus-client/lib/structures";
import { ComponentActionData, ComponentButton, ComponentContext } from "detritus-client/lib/utils";

import { VCNotifyManager } from "..";

export class VCNotifyToggleButtonComponent extends ComponentButton {
    watchedId: string;
    createNewMessage: boolean;

    constructor(watchedId: string, createNewMessage = false, data?: ComponentActionData) {
        super(data);

        this.customId = "vcnotify";

        this.watchedId = watchedId;
        this.createNewMessage = createNewMessage;

        this.emoji = { name: "🔔" };
        this.label = "Toggle VC Notification";
        this.style = MessageComponentButtonStyles.PRIMARY;
    }

    run(ctx: ComponentContext) {
        const toggleString = VCNotifyManager.toggleMessage(this.watchedId, ctx.userId);

        const message: InteractionEditOrRespond = {
            content: toggleString,
            flags: MessageFlags.EPHEMERAL,
        };

        if (this.createNewMessage) {
            return ctx.createResponse({
                type: InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
                data: message,
            });
        } else {
            return ctx.editOrRespond(message);
        }
    }
}
