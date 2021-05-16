import { PalmCommandOptions } from "./";

const pingCommand: PalmCommandOptions = {
    name: "ping",
    metadata: {
        description: "Launches a nuke.",
        usage: "ping",
    },
    ratelimit: {
        duration: 5000,
        limit: 3,
        type: "guild",
    },
    run: async (ctx) => {
        const msg = await ctx.editOrReply(
            `Pong! - Gateway: \`???ms\` Rest: \`???ms\``
        );
        const { gateway, rest } = await ctx.client.ping();

        return msg.edit(
            `Pong! - Gateway: \`${gateway}ms\` Rest: \`${rest}ms\``
        );
    },
};

export default pingCommand;
