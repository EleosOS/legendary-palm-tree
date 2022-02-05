import { Permissions } from "detritus-client/lib/constants";

import { BaseSlashCommand } from "../Basecommand";
import HueChangeCommand from "./hue/Change";
import HueOverwriteCommand from "./hue/Overwrite";

class HueGroupCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "hue",
            description: "[ADMIN] Commands to manage the hue changing of the server icon",
            permissions: [Permissions.ADMINISTRATOR],
            options: [new HueChangeCommand(), new HueOverwriteCommand()],
        });
    }
}

export default HueGroupCommand;
