import { BaseSlashCommand } from "../";

import CustomRoleCreateCommand from "./customrole/Create";
import CustomRoleInspectCommand from "./customrole/Inspect";
import CustomRoleRemoveCommand from "./customrole/Remove";

class RoleGroupCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "customrole",
            description: "Create your own custom role",
            options: [new CustomRoleCreateCommand(), new CustomRoleInspectCommand(), new CustomRoleRemoveCommand()],
        });
    }
}

export default RoleGroupCommand;
