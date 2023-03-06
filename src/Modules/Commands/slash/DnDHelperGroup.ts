import { Interaction } from "detritus-client";
import { Permissions } from "detritus-client/lib/constants";

import { BaseSlashCommand } from "../";

import NewSessionCommand from "./dndhelper/NewSession";
import NewSessionPrefillGroupCommand from "./dndhelper/NewSessionPrefillGroup";

class DnDHelperGroupCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "dndhelper",
            description: "[SPECIAL] Garage tools",
            permissionsClient: [Permissions.MANAGE_GUILD],
            options: [new NewSessionCommand(), new NewSessionPrefillGroupCommand()],
        });
    }

    onBeforeRun(ctx: Interaction.InteractionContext) {
        return ctx.member!.roles.has("718217257754296320");
    }

    onCancelRun(ctx: Interaction.InteractionContext) {
        return this.ephEoR(ctx, "Only people with the <@&718217257754296320> may use this command.", 2);
    }
}

export default DnDHelperGroupCommand;
