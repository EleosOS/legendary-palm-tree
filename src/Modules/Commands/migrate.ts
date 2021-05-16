import { PalmCommandOptions } from "./";
import { migrateDBToMySQL } from "../Migration";
import { Strings } from '../';

const migrateCommand: PalmCommandOptions = {
    name: "migrate",
    metadata: {
        description: Strings.containment.beta.stringClassifiedAccessDenied,
        usage: Strings.containment.beta.classified,
        hidden: true,
    },
    ratelimit: {
        duration: 5000,
        limit: 3,
        type: "guild",
    },
    onBefore: (ctx) => ctx.user.isClientOwner,
    onCancel: (ctx) =>
        ctx.reply(Strings.containment.beta.containmentOperationalAccessDenied),
    run: async (ctx) => {
        migrateDBToMySQL(ctx);
        ctx.editOrReply(Strings.containment.beta.successQuestionmark);
    },
};

export default migrateCommand;
