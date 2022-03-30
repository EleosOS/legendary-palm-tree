import { InteractionCallbackTypes, MessageComponentButtonStyles, MessageFlags } from "detritus-client/lib/constants";
import { InteractionContext } from "detritus-client/lib/interaction";
import { InteractionEditOrRespond } from "detritus-client/lib/structures";
import { ComponentActionData, ComponentButton, ComponentContext, ComponentSelectMenu, Embed, InteractionModal } from "detritus-client/lib/utils";

const topicList = [
    {
        label: "About this bot",
        value: "about",
    },
    {
        label: "Changelog",
        value: "changelog",
    },
    {
        label: "Custom Roles",
        value: "customrole",
    },
    {
        label: "VC Notifications",
        value: "vcnotify",
    },
    {
        label: "Server Icon Hue Changing",
        value: "hue",
    },
    {
        label: "Misc.",
        value: "misc",
    },
];

export class HelpSelectMenuComponent extends ComponentSelectMenu {
    embed: Embed;
    admin: boolean;

    constructor(ctx: InteractionContext, data?: ComponentActionData) {
        super(data);

        this.customId = "helpSelect";
        this.embed = new Embed({
            author: {
                icon_url: ctx.me!.avatarUrl,
                name: ctx.me!.username,
            },
            title: "Help",
            description: `Select a topic below. *Some information can only be seen by admins because it isn't relevant to normal users.*`,
        });

        this.admin = ctx.member!.canAdministrator;

        this.maxValues = 1;
        this.placeholder = "Select a topic...";

        topicList.forEach((element) => {
            this.createOption(element);
        });
    }

    run(ctx: ComponentContext) {
        const values = ctx.data.values ?? [];
        const response: InteractionEditOrRespond = {
            flags: MessageFlags.EPHEMERAL,
            embed: this.embed,
        };

        if (this.embed.fields) this.embed.fields.clear();

        if (values.length === 0) {
            return ctx.editOrRespond(response);
        } else {
            switch (values[0]) {
                case "about":
                    response.embed = this.about();
                    break;

                case "changelog":
                    response.embed = this.changelog();
                    break;

                case "customrole":
                    response.embed = this.customrole();
                    break;

                case "vcnotify":
                    response.embed = this.vcnotify();
                    break;

                case "hue":
                    response.embed = this.hue();
                    break;

                case "misc":
                    response.embed = this.misc();
                    break;

                default:
                    break;
            }
        }

        return ctx.editOrRespond(response);
    }

    private about(): Embed {
        this.embed.setTitle("Help: About this bot");
        this.embed.setDescription(
            `This bot was developed by <@249880389160665089> for small, private servers (max. 50 members maybe). It mainly adds more utilities and customization for users, check out the topics to see what it can do.
It isn't a single, publicly available bot which anyone can invite, it has to be self hosted and only supports one server.
\nIt's open source under the name "legendary-palm-tree": [GitHub](https://github.com/EleosOS/legendary-palm-tree)`
        );

        return this.embed;
    }

    private changelog(): Embed {
        this.embed.setTitle("Help: Changelog");
        this.embed.setDescription(
            `See what changed with each major version. Many versions only had internal changes which aren't listed. *Some listed changes can only be seen by admins.*`
        );

        this.embed.addField(
            "Version 1.1",
            `All important info on commands has been moved into the slash command UI.
\nAll commands have been reworked into slash commands, that means the prefix \`os\` has also been retired. Slash commands are available in every channel, even if the bot can't see it.
\nMost, if not all command responses are now "ephemeral", they will only show up for you personally.
\n\`role\` - Role creation/editing has been moved into the subcommand \`/role create\`.
\n\`role info\` - Has been renamed to \`/role inspect\`. You can now inspect the role of every user, not just your own.`
        );

        this.embed.addField(
            "Version 1.2",
            `Custom Roles now stay at the bottom of the roles list.
${this.admin ? "\n*Admins can now overwrite the stored server icon hue value without actually changing the hue.*" : ""}`
        );

        this.embed.addField(
            "Version 1.3",
            `Admins can now change the schedule of hue changes and how much it should change each time.
\nHue changes will be cancelled if the server icon is animated.
\nThe bot can now send a message when a member leaves the server.
${this.admin ? "\n*There are now many more usage logs available.*" : ""}`
        );

        this.embed.addField(
            "Version 2",
            `VC Notifications have been added.
\n\`/help\` - Has been reworked with a select menu and now includes descriptions of features.
\n\`/role\` - The parent command has been renamed to \`/customrole\`.
\nCustom Roles are now automatically deleted when their user leaves the server.
${this.admin ? "\n*Command usage logs have been improved to include the used arguments.*" : ""}`
        );

        return this.embed;
    }

    private customrole(): Embed {
        this.embed.setTitle("Help: Custom Roles");
        this.embed.setDescription(`Custom roles are roles that you can create yourself. You decide the name and color. One user can only have one custom role.
${this.admin ? "\n*New custom roles will always be on the bottom of the role list among other custom roles. Make sure other roles above them don't override the color!*" : ""}`);

        this.embed.addField(
            "Commands",
            `\`/customrole create (hex) (rolename)\` - Creates a new custom role or edits the current custom role.
hex: A valid hex color code, for example "#4c88ff" (# included).
rolename: The name that your role should have, can only be max. 100 characters long.
\n\`/customrole remove\` - Removes your custom role.
\n\`/customrole inspect (user)\` - Shows information on the custom role of the selected user, like name and color.`
        );

        if (this.admin) {
            this.embed.addField("Admin - Logging", `The bot can log when a custom role is created or removed, including the user and information on the role.`);
        }

        return this.embed;
    }

    private vcnotify(): Embed {
        this.embed.setTitle("Help: VC Notifications");
        this.embed
            .setDescription(`The bot can send you a message when a specific user joins a voice channel (that the bot can see). You can toggle a notification on each user with both a slash command and through the context menu of a user.
${this.admin ? "\n*❗ The host of the bot needs to configure in which channel notifications should be sent in, otherwise this feature will not work!*" : ""}`);

        this.embed.addField("Context Menu", `Right click a user, under Apps select "Toggle VC Notification". You will see a confirmation message.`);

        this.embed.addField("Quick Toggle Button", `Messages of this feature include a button with which a VC notification can quickly be toggled again.`);

        this.embed.addField(
            "Commands",
            `\`/vcnotify toggle (user)\` - Toggle a VC notification on the selected user.
\n\`/vcnotify list\` - Shows a list of all users that you'll be notified for.`
        );

        if (this.admin) {
            this.embed.addField("Admin - Logging", `The bot can log when a VC notification is set and when one is triggered, including the related users.`);
        }

        return this.embed;
    }

    private hue(): Embed {
        this.embed.setTitle("Help: Server Icon Hue Changing");
        this.embed
            .setDescription(`The bot can automatically change the hue of the server icon at a set schedule. Admins can set the schedule and by how many degrees the hue should change. The hue can also be changed manually.
❗ Animated server icons are not supported due to technical limitations. The bot will cancel any hue changes and send warnings if it detects that the server icon is animated.
\nHues are circular, meaning any amounts or hues specified are between 0° and 360°.`);

        this.embed.addField(
            "Scheduling",
            `Scheduling is done with cron expressions. The standard schedule is "0 0 * * *" (At 12 am). [Cron Expression Generator by crontabkit.com](https://crontabkit.com/crontab-expression-generator)
❗ Do not change the icon often! A schedule of e.g. multiple times per hour should be avoided!`
        );

        this.embed.addField(
            "Commands",
            `\`/hue change (amount)\` - Changes the server icon hue.
amount: How much the hue should change.
\n\`/hue overwrite (amount)\` - Overwrite the stored hue, for example in case a new server icon was uploaded.
\n\`/hue step schedule (cronexpression)\` - Sets a new schedule at which the hue will be automatically changed, see "Scheduling".
\n\`/hue step size (amount) - Sets how much the hue should be automatically changed.\``
        );

        if (this.admin) {
            this.embed.addField("Admin - Logging", `The bot can log when the hue or settings get changed, including old and new values.`);
        }

        return this.embed;
    }

    private misc(): Embed {
        this.embed.setTitle("Help: Miscellaneous");
        this.embed.setDescription(null);

        this.embed.addField(
            "Commands",
            `\`/help\` - You're looking at it right now!
\n\`/ping\` - Pong!
\n\`/purge (amount)\` - Deletes the specified amount of messages, between 2 and 100 messages at a time.
\n\`Message Context Menu: Purge Below - Deletes up to 100 messages sent after the selected message (minimum 2).\``
        );

        this.embed.addField("User Left Messages", `The bot can be set up to send a message in a specific channel when a user leaves the server.`);

        this.embed.addField("Ratelimits", `Some commands have different ratelimits and will be cancelled if used too much.`);

        this.embed.addField(
            "Permissions",
            `The bot needs the "Manage Server", "Manage Messages" and "Manage Roles" permissions. Certain commands that require them will cancel if the bot is missing them.
Users are considered admins if they have the "Administrator" permission. Admin commands will cancel if the user doesn't have permission to use them.
\nDiscord is currently working on introducing a new, more customizable permission system, so this might change.`
        );

        if (this.admin) {
            this.embed.addField(
                "Admin - Logging",
                `The bot can be set up to log anything related to it, like e.g. command usage. Logs usually include additional information like the arguments used with a command.
\nLogging is done through Webhooks, so you can decide where these logs should go. They also however need to be set up by the host in the bot configuration.`
            );

            this.embed.addField("Admin - Host", "Please regularly restart the bot and the machine it's hosted on, to avoid errors and degrading.");
        }

        return this.embed;
    }
}
