import { BaseSlashCommand } from "../Basecommand";

import RoleCreateCommand from "./role/Create";
import RoleInfoCommand from "./role/Info";
import RoleRemoveCommand from "./role/Remove";

class RoleGroupCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "role",
            description: "Create your own custom role",
            options: [new RoleCreateCommand(), new RoleInfoCommand(), new RoleRemoveCommand()],
        });
    }
}

export default RoleGroupCommand;
