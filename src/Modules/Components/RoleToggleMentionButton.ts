import { InteractionCallbackTypes, MessageComponentButtonStyles, MessageFlags } from "detritus-client/lib/constants";
import { Role } from "detritus-client/lib/structures";
import { ComponentActionData, ComponentButton, ComponentContext } from "detritus-client/lib/utils";

export class RoleToggleMentionButtonComponent extends ComponentButton {
    role: Role;

    constructor(role: Role, data?: ComponentActionData) {
        super(data);

        this.customId = "roleToggleMention";

        this.role = role;

        this.label = "Toggle Mentionable";
        this.style = MessageComponentButtonStyles.PRIMARY;
    }

    async run(ctx: ComponentContext) {
        // Update the cached role
        ctx.guild!.fetchRoles().then((value) => {
            const role = value.get(this.role.id);

            if (role) {
                this.role = role;
            } else {
                this.disabled = true;

                return ctx.editOrRespond({
                    content: "❌  **This role is not available anymore.**",
                });
            }
        });

        // Edit it
        this.role = await this.role.edit({
            mentionable: !this.role.mentionable,
            reason: `Edited by ${ctx.user.name}#${ctx.user.discriminator} through button component`,
        });

        return ctx.createResponse({
            type: InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                flags: MessageFlags.EPHEMERAL,
                content: `✅  **<@&${this.role.id}> is ${this.role.mentionable ? "now" : "no longer"} mentionable.**`,
            },
        });
    }

    onError(ctx: ComponentContext, err: Error) {
        console.error(err);
    }
}
