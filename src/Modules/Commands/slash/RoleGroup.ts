import { BaseSlashCommand } from "../Basecommand";

import RoleInfoCommand from "./role/Info";

class RoleGroupCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "role",
            description: "Create your own custom role",
            options: [new RoleInfoCommand()],
        });
    }
}

export default RoleGroupCommand;
