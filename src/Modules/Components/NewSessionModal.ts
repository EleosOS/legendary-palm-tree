import { InteractionCallbackTypes, MessageComponentInputTextStyles, MessageFlags } from "detritus-client/lib/constants";
import { ChannelGuildForum, ChannelGuildThread, GuildScheduledEvent } from "detritus-client/lib/structures";
import { InteractionModal, InteractionModalArgs, InteractionModalContext, InteractionModalOptions } from "detritus-client/lib/utils";
import { NewSessionPrefill } from "../../Entities";
import { DnDNewSessionHelperClass } from "../DnDNewSessionHelper";

interface NewSessionModalComponentArgs {
    eventTitle: string | undefined;
    sessionNumber: string | undefined;
    schedulingThreadTitle: string | undefined;
    eventDescription: string | undefined;
    keyArt: string | undefined;
}

/*
 * This component takes prefilled texts (NewSessionPrefill) from the Database
 * After submitting it creates an event and thread
 */
export class NewSessionModalComponent extends InteractionModal {
    constructor(data?: InteractionModalOptions, prefill?: NewSessionPrefill) {
        super(data);

        this.customId = "newsessionmodal";
        this.title = "Create New Session";

        this.addInputText({
            label: "Event Title",
            custom_id: "eventTitle",
            style: MessageComponentInputTextStyles.SHORT,
            placeholder: "Campaign Name - Session (number)",
            value: prefill ? prefill.eventTitle : undefined,
        });

        this.addInputText({
            label: "Session Number",
            custom_id: "sessionNumber",
            style: MessageComponentInputTextStyles.SHORT,
            placeholder: "(number)",
            value: prefill ? prefill.sessionNumber.toString() : undefined,
        });

        this.addInputText({
            label: "Scheduling Thread Title",
            custom_id: "schedulingThreadTitle",
            style: MessageComponentInputTextStyles.SHORT,
            placeholder: "Session (number)",
            value: prefill ? prefill.schedulingThreadTitle : undefined,
        });

        this.addInputText({
            label: "Event Description",
            custom_id: "eventDescription",
            style: MessageComponentInputTextStyles.PARAGRAPH,
        });

        /*this.addInputText({
            label: "Include Campaign Keyart in Event?",
            custom_id: "keyArt",
            style: MessageComponentInputTextStyles.SHORT,
            placeholder: "true or false",
            value: "true",
        });*/
    }

    async run(ctx: InteractionModalContext, args: NewSessionModalComponentArgs) {
        let sessionNumber: string | undefined;
        let includeKeyArt: boolean | undefined;

        if (!args.eventTitle) {
            return ctx.editOrRespond({
                flags: MessageFlags.EPHEMERAL,
                content: "❌  **An event title is required.**",
            });
        }

        if (!args.schedulingThreadTitle) {
            return ctx.editOrRespond({
                flags: MessageFlags.EPHEMERAL,
                content: "❌  **A scheduling thread title is required.**",
            });
        }

        if (args.sessionNumber) {
            sessionNumber = args.sessionNumber
        } else {
            sessionNumber = "0";
        }

        if (args.keyArt && (args.keyArt === "true" || args.keyArt === "false")) {
            includeKeyArt = Boolean(args.keyArt);
        }

        const today = new Date();
        const daysUntilSunday = (7 - today.getDay()) % 7 || 7;
        const eventDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilSunday, 19);

        // Create Event
        // TODO: Add image
        const event: GuildScheduledEvent = await ctx.rest.post({
            url: `https://discord.com/api/v9/guilds/${ctx.guildId}/scheduled-events`,
            useAuth: true,
            body: {
                channel_id: "718218055611580577",
                name: args.eventTitle.replace("?", args.sessionNumber ?? "0"),
                privacy_level: 2,
                scheduled_start_time: eventDateTime.toISOString(),
                description: args.eventDescription,
                entity_type: 2,
            },
        });

        // Create scheduling thread
        const thread: ChannelGuildThread = await ctx.rest.post({
            url: `https://discord.com/api/v9/channels/1030108368188215357/threads`,
            useAuth: true,
            body: {
                name: args.schedulingThreadTitle.replace("?", sessionNumber),
                message: {
                    content: `<@&718217257754296320> https://discord.com/events/${ctx.guildId}/${event.id}`
                }
            }
        });

        return ctx.respond({
            type: InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: MessageFlags.EPHEMERAL,
                content: `✅  **A new session has been created:**\n\n<#${thread.id}>\nhttps://discord.com/events/${ctx.guildId}/${event.id}`,
            }
        });
    }
}
