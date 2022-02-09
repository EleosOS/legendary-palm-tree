import { Config } from "../config";

export interface IConfig {
    token: string;
    guildId: string;
    webhooks: {
        serverImgHue: string;
        customRoles: string;
    };
    db: {
        host: string;
        port: number;
        username: string;
        password: string;
        db: string;
    };
    behavior: IBehaviorConfig;
}

interface IBehaviorConfig {
    shouldIconHueChange: boolean;
    shouldEnableCustomRoles: boolean;
    shouldIconHueAutomaticallyChange: boolean;
    iconHueStep: number;
    enabledCommands: {
        help: boolean;
        ping: boolean;
        purge: boolean;
        role: {
            inspect: boolean;
        };
    };
}

const { behavior } = Config;
const { enabledCommands } = behavior;

export const DynBehaviorConfig: IBehaviorConfig = {
    shouldIconHueChange: behavior.shouldIconHueChange || true,
    shouldEnableCustomRoles: behavior.shouldEnableCustomRoles || true,
    shouldIconHueAutomaticallyChange: behavior.shouldIconHueChange || true,
    iconHueStep: behavior.iconHueStep || 10,
    enabledCommands: {
        help: enabledCommands.help || true,
        ping: enabledCommands.ping || true,
        purge: enabledCommands.purge || true,
        role: {
            inspect: enabledCommands.role.inspect || true,
        },
    },
};
