import { Interaction } from "detritus-client";
import { Permissions, InteractionCallbackTypes,  ApplicationCommandOptionTypes } from "detritus-client/lib/constants";

import { BaseCommandOption } from "../..";
import { NewSessionModalComponent } from "../../../Components/";
import { DnDNewSessionHelperClass } from "../../../DnDNewSessionHelper";

interface NewSessionArgs {
    prefillname: string;
    increasesessionnumber: boolean;
}

class NewSessionCommand extends BaseCommandOption {
    constructor() {
        super({
            name: "newsession",
            description: "[SPECIAL] Quickly create a new event and scheduling thread for the next DnD session.",
            disableDm: true,
            permissionsClient: [Permissions.MANAGE_EVENTS],
            ratelimit: {
                duration: 3000,
                limit: 1,
                type: "guild",
            },
            options: [
                {
                    name: "prefillname",
                    description: "Name of the prefill to use",
                    type: ApplicationCommandOptionTypes.STRING,
                },
                {
                    name: "increasesessionnumber",
                    description: "If the session number should be increased or not",
                    type: ApplicationCommandOptionTypes.BOOLEAN,
                },
            ],
        });
    }

    async run(ctx: Interaction.InteractionContext, args: NewSessionArgs) {
        const prefill = await DnDNewSessionHelperClass.getPrefill(args.prefillname, ctx.guildId!);

        await ctx.createResponse({
            type: InteractionCallbackTypes.MODAL,
            data: new NewSessionModalComponent(undefined, prefill)
        });

        // This will increase the number even if the modal isn't sent
        if (prefill && args.increasesessionnumber) {
            DnDNewSessionHelperClass.increaseSessionNumber(prefill);
        }
    }
}

export default NewSessionCommand;
