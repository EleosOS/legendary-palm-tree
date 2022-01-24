import { Structures } from "detritus-client";
import { Embed } from "detritus-client/lib/utils";

export function createInfoEmbed(user: Structures.User | Structures.Member, role: Structures.Role) {
    return new Embed({
        author: {
            name: `Custom Role of ${user.name}#${user.discriminator}`,
            icon_url: user.avatarUrl,
        },
        title: role.name,
        fields: [
            {
                name: "Color",
                value: `#${role.color.toString(16)}`,
                inline: true,
            },
            {
                name: "Positon",
                value: `${role.position}`,
                inline: true,
            },
            {
                name: "Mention",
                value: role.mention,
                inline: true,
            },
        ],
        color: role.color,
    });
}
