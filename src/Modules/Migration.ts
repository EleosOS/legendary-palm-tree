/*import { DB } from "./Database";
import { Signale } from "./Signale";
import jsonFile from "jsonfile";
import { Context } from "detritus-client/lib/command";

export async function createDB() {
    await DB.query(
        "CREATE TABLE customRoles (id INT PRIMARY KEY AUTO_INCREMENT UNIQUE, userId VARCHAR(255) NOT NULL UNIQUE, roleId VARCHAR(255) UNIQUE);"
    );
    await DB.query(
        "CREATE TABLE hue (id INT PRIMARY KEY AUTO_INCREMENT UNIQUE, currentHue INT);"
    );
}

export async function migrateDBToMySQL(ctx: Context) {
    const guild = ctx.guilds.get("649352572464922634")!;

    guild.members.forEach(async (member) => {
        let data = {
            roleId: "",
        };

        await jsonFile
            .readFile(`./src/db/${member.id}.json`)
            .then((d) => {
                data = d;
            })
            .catch((e) => {
                e;
            });

        if (data.roleId.length == 0) {
            Signale.debug({
                prefix: "migration",
                message: `${member.id} has no custom role - skipped.`,
            });
        } else {
            await DB.query(
                "INSERT INTO customRoles (userId, roleId) VALUES (?, ?)",
                [member.id, data.roleId]
            )
                .then((res) => {
                    Signale.debug({
                        prefix: "migration",
                        message: `memberId: ${member.id} - roleId: ${data.roleId} - Migrated.`,
                    });
                })
                .catch((err) => {
                    Signale.error({
                        prefix: "migration",
                        message: `memberId: ${member.id} - roleId: ${data.roleId} - ⚠ Migration failed!`,
                    });
                    DB.sqlErrorLog(err);
                });
        }
    });
}
*/
