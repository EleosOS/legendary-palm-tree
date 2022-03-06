import { InteractionCallbackTypes, MessageComponentButtonStyles } from "detritus-client/lib/constants";
import { ComponentActionData, ComponentButton, ComponentContext, InteractionModal } from "detritus-client/lib/utils";

export class OpenModalButtonComponent extends ComponentButton {
    modal: InteractionModal;

    constructor(modal: InteractionModal, label?: string, data?: ComponentActionData) {
        super(data);

        this.customId = "openModal";

        this.modal = modal;
        this.label = label ?? "Open Modal";

        this.emoji = { name: "📝" };
        this.style = MessageComponentButtonStyles.PRIMARY;
    }

    run(ctx: ComponentContext) {
        return ctx.respond({
            type: InteractionCallbackTypes.MODAL,
            data: this.modal,
        });
    }
}
