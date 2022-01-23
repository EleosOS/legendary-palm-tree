import PingCommand from "./slash/Ping";
import PurgeCommand from "./slash/Purge";
import HueCommand from "./slash/Hue";

export default [new PingCommand(), new PurgeCommand(), new HueCommand()];
