import HelpCommand from "./slash/Help";
import HueCommand from "./slash/Hue";
import PingCommand from "./slash/Ping";
import PurgeCommand from "./slash/Purge";
import RoleGroupCommand from "./slash/RoleGroup";

export default [new HelpCommand(), new HueCommand(), new PingCommand(), new PurgeCommand(), new RoleGroupCommand()];
