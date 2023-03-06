import { BaseCommandOptionGroup } from "../../";

import NewSessionPrefillCreateCommand from "./prefill/Create";
import NewSessionPrefillDeleteCommand from "./prefill/Delete";
import NewSessionPrefillEditCommand from "./prefill/Edit";
import NewSessionPrefillListCommand from "./prefill/List";

class NewSessionPrefillGroupCommand extends BaseCommandOptionGroup {
    constructor() {
        super({
            name: "prefill",
            description: "[SPECIAL] Commands to manage the new session prefills of the dndhelper commands",
            options: [new NewSessionPrefillCreateCommand(), new NewSessionPrefillDeleteCommand(), new NewSessionPrefillEditCommand(), new NewSessionPrefillListCommand()],
        });
    }
}

export default NewSessionPrefillGroupCommand;
