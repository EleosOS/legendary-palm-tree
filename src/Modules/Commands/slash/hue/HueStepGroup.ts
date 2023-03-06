import { BaseCommandOptionGroup } from "../../";

import HueStepScheduleCommand from "./step/Schedule";
import HueStepSizeCommand from "./step/Size";

class HueStepGroupCommand extends BaseCommandOptionGroup {
    constructor() {
        super({
            name: "step",
            description: "[ADMIN] Commands to manage the automatic hue changing of the server icon",
            options: [new HueStepScheduleCommand(), new HueStepSizeCommand()],
        });
    }
}

export default HueStepGroupCommand;
