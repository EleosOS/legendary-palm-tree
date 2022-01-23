export const Strings = {
    bot: {
        error: "⚠  **Something went wrong.** `?`",
        ratelimitReached: "⚠  **You've reached the ratelimit. Slow down.**",
    },
    commands: {
        general: {
            usageNotAllowed: "⚠  **You're not allowed to use this command.**",
            noDM: "⚠  **This command cannot be used in direct messages.**",
            argsIncorrectOrIncomplete: "⚠  **The given arguments are incorrect or incomplete. Use oshelp for more info.**",
        },
        help: {
            doesntExist: "❌  **That command doesn't exist.**",
            listOfCommands: "ℹ  **List of commands**\n",
            moreInfos: "\n\n**For more infos on a command, type `oshelp [command]`.**",
        },
        hue: {
            noIconOrUsageNotAllowed: "⚠  **This server doesn't have an icon or you're not allowed to use this command.**",
            iconHueManuallyChanged: "✅  **The server icon hue has been manually changed.**",
        },
        roles: {
            userRemovedRole: "User removed custom role",
            userChangedRole: "User changed role settings",
            noRole: "⚠  **You don't have a custom role.**",
            roleRemoved: "✅  **Custom role removed.**",
            roleEdited: "✅  **Custom role edited.**",
            roleCreated: "✅  **Custom role created.**",
        },
        purge: {
            deletedMessages: "✅  **Deleted ? messages.**",
            failedNotEnough: "⚠  **There were not enough messages to purge.**",
            failedInvalidArgs: "⚠  **Only 2-100 messages at a time can be deleted.**",
        },
    },
    containment: {
        beta: {
            classified: "`β: Classified`",
            stringClassifiedAccessDenied: "`β: String Classified - Access Denied`",
            containmentOperationalAccessDenied: "⚠  `β Containment Operational - Access Denied`",
            successQuestionmark: "`β: Success?`",
        },
    },
};
