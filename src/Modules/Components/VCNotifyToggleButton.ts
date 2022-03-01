import { MessageComponentButtonStyles, MessageFlags } from "detritus-client/lib/constants";
import { InteractionEditOrRespond } from "detritus-client/lib/structures";
import { ComponentActionData, ComponentActionRow, ComponentButton, ComponentContext } from "detritus-client/lib/utils";

import { VCNotifyManager } from "..";

new ComponentActionRow({});

export class VCNotifyToggleButtonComponent extends ComponentButton {
    componentId: string;
    watchedId: string;

    constructor(watchedId: string, data?: ComponentActionData) {
        super(data);

        this.componentId = "vcnotify:";
        this.watchedId = watchedId;

        this.customId = this.componentId + this.watchedId;
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

        return ctx.editOrRespond(message);
    }
}
