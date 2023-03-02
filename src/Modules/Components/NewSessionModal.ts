import { InteractionCallbackTypes, MessageComponentInputTextStyles } from "detritus-client/lib/constants";
import { InteractionModal, InteractionModalArgs, InteractionModalContext, InteractionModalOptions } from "detritus-client/lib/utils";
import { DnDNewSessionHelperClass } from "../DnDNewSessionHelper";

/*
 * This component fetches prefilled texts from the Database
 * After submitting it creates an event and thread
 */
export class NewSessionModalComponent extends InteractionModal {
    constructor(prefillName: string, data?: InteractionModalOptions) {
        super(data);

        this.customId = "newsessionmodal";
        this.title = "Create New Session";

        let prefill = DnDNewSessionHelperClass.getPrefill(prefillName)

        this.addInputText({
            label: "Event Title",
            custom_id: "newsessioneventtitleinputtext",
            style: MessageComponentInputTextStyles.SHORT,
            placeholder: "Campaign Name - Session (number)",
            value: "TBD"
        });

        this.addInputText({
            label: "Session Number",
            custom_id: "newsessionsessionnumberinputtext",
            style: MessageComponentInputTextStyles.SHORT,
            placeholder: "(number)",
            value: "TBD"
        });

        this.addInputText({
            label: "Scheduling Thread Title",
            custom_id: "newsessionschedulingthreadtitleinputtext",
            style: MessageComponentInputTextStyles.SHORT,
            placeholder: "Session (number)",
            value: "TBD"
        });

        this.addInputText({
            label: "Event Description",
            custom_id: "newsessioneventdescriptioninputtext",
            style: MessageComponentInputTextStyles.PARAGRAPH,
            value: "TBD"
        });

        this.addInputText({
            label: "Include Campaign Keyart in Event?",
            custom_id: "newsessionkeyartinputtext",
            style: MessageComponentInputTextStyles.SHORT,
            placeholder: "true or false",
            value: "true"
        });
    }

    run(ctx: InteractionModalContext, args: InteractionModalArgs) {
        
    }
}
