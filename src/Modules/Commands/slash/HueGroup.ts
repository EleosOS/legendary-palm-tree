import { Interaction } from "detritus-client";
import { Permissions } from "detritus-client/lib/constants";

import { BaseSlashCommand } from "../";
import { checkIfGuildIconIsGif } from "../..";

import HueChangeCommand from "./hue/Change";
import HueStepGroupCommand from "./hue/HueStepGroup";
import HueOverwriteCommand from "./hue/Overwrite";

class HueGroupCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "hue",
            description: "[ADMIN] Commands to manage the hue changing of the server icon",
            permissions: [Permissions.ADMINISTRATOR],
            permissionsClient: [Permissions.MANAGE_GUILD],
            options: [new HueStepGroupCommand(), new HueChangeCommand(), new HueOverwriteCommand()],
        });
    }

    onBeforeRun(ctx: Interaction.InteractionContext) {
        return ctx.guild!.iconUrl !== null || !checkIfGuildIconIsGif(false);
    }

    onCancelRun(ctx: Interaction.InteractionContext) {
        return this.ephEoR(ctx, "This server either doesn't have an icon or an animated server icon, animated server icons are not supported.", 3);
    }
}

export default HueGroupCommand;
