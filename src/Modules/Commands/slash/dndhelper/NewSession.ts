import { Interaction } from "detritus-client";
import { Permissions, InteractionCallbackTypes, MessageComponentInputTextStyles, ApplicationCommandOptionTypes } from "detritus-client/lib/constants";
import { ComponentInputText, InteractionModal } from "detritus-client/lib/utils";

import { BaseCommandOption } from "../..";

interface NewSessionArgs {
    prefillName: string;
}

const NewSessionModal = new InteractionModal({
    title: "Create New Session",
    custom_id: "createnewsessionmodal",
    components: [
        new ComponentInputText({
            label: "Event Title",
            custom_id: "newsessioneventtitleinputtext",
            style: MessageComponentInputTextStyles.SHORT,
            value: "TBD"
        }),
    ]
})

class NewSessionCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "newdndsession",
            description: "[SPECIAL] Automatically creates a new event and scheduling thread for the next DnD session.",
            permissionsClient: [Permissions.MANAGE_EVENTS],
            ratelimit: {
                duration: 3000,
                limit: 1,
                type: "guild",
            },
            options: [
                {
                    name: "prefill",
                    description: "Name of the prefill to use",
                    type: ApplicationCommandOptionTypes.STRING,
                },
            ],
        });
    }

    async run(ctx: Interaction.InteractionContext, args: NewSessionArgs) {
        ctx.createResponse({
            type: InteractionCallbackTypes.MODAL,
            data: 
        })
    }
}

export default NewSessionCommand;
