import { BaseSlashCommand } from "../";

import VCNotifyToggleCommand from "./vcnotify/Toggle";
import VCNotifyListCommand from "./vcnotify/List";

class VCNotifyGroupCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "vcnotify",
            description: "Get notified when a user joins a voice channel",
            options: [new VCNotifyToggleCommand(), new VCNotifyListCommand()],
        });
    }
}

export default VCNotifyGroupCommand;
