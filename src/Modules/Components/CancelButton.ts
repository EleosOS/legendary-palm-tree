import { InteractionCallbackTypes, MessageComponentButtonStyles, MessageComponentTypes, MessageFlags } from "detritus-client/lib/constants";
import { ComponentActionData, ComponentButton, ComponentContext } from "detritus-client/lib/utils";

export class CancelButtonComponent extends ComponentButton {
    constructor(data?: ComponentActionData) {
        super(data);

        this.customId = "cancel";
        this.label = "Cancel";

        this.style = MessageComponentButtonStyles.SECONDARY;
    }

    run(ctx: ComponentContext) {
        this.label = "Cancelled";
        this.disabled = true;

        return ctx.respond({
            type: InteractionCallbackTypes.UPDATE_MESSAGE,
            data: {
                components: [
                    {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [this],
                    },
                ],
            },
        });
    }
}
