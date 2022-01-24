import PingCommand from "./slash/Ping";
import PurgeCommand from "./slash/Purge";
import HueCommand from "./slash/Hue";
import RoleGroupCommand from "./slash/RoleGroup";

export default [new PingCommand(), new PurgeCommand(), new HueCommand(), new RoleGroupCommand()];
