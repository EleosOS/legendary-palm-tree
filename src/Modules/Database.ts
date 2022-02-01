import mysql from "mysql2";
import { Pool } from "mysql2/promise";
import { Config } from "../config";
import { Signale } from "./Signale";

class Database {
    private pool: Pool;

    constructor(Config: any) {
        this.pool = mysql
            .createPool({
                host: Config.db.host,
                user: Config.db.username,
                password: Config.db.password,
                database: Config.db.db,
                connectionLimit: Config.db.connectionLimit,
            })
            .promise();
    }

    sqlErrorLog(err: mysql.QueryError) {
        if (err.fatal) {
            return Signale.fatal({
                prefix: "DB",
                err: err,
            });
        } else {
            return Signale.error({
                prefix: "DB",
                err: err,
            });
        }
    }

    async query(sql: string, values?: string[]) {
        let result;

        result = await this.pool.execute(sql, values).catch((err: mysql.QueryError) => {
            this.sqlErrorLog(err);
            return null;
        });

        return result;
    }

    /*async transact(sql: string, values?: string[]) {
        let con;

        try {
            let result;
            con = await this.pool.getConnection();

            await con.beginTransaction();
            result = await con.query(sql, values);
            await con.commit();

            return result;
        } catch (err) {
            await con?.rollback();

            err;
            Signale.error({ prefix: "DB", message: err });
            return null;
        } finally {
            con?.release();
        }
    }*/
}

export const DB = new Database(Config);
