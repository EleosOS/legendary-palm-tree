export * from "./Basecommand";

import HelpCommand from "./slash/Help";
import HueGroupCommand from "./slash/HueGroup";
import PingCommand from "./slash/Ping";
import PurgeCommand from "./slash/Purge";
import RoleGroupCommand from "./slash/RoleGroup";

import VCNotifyContextCommand from "./contextUser/VCNotify";

export default [new HelpCommand(), new HueGroupCommand(), new PingCommand(), new PurgeCommand(), new RoleGroupCommand(), new VCNotifyContextCommand()];
