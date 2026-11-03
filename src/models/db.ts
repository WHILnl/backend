import sqlite3 from "sqlite3";
import type { device_token } from "./db_tables.ts";
import config from "../config/config.ts";

export const db = new sqlite3.Database("sqlite.db");

db.run(`
    CREATE TABLE IF NOT EXISTS device_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT,
        issuedAt INTEGER, -- Unix epoch timestamp
        lastUsed INTEGER,  -- Unix epoch timestamp
        revokedAt INTEGER -- Unix epoch timestamp
    );
`);

export const helpers = {
    device_token: {
        async validate(token: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
                db.get('SELECT * FROM device_tokens WHERE token = ?', token, function (err, row: device_token) {
                if (err) {
                    console.error(err);
                    return reject();
                }
                if (row == undefined) {
                    return resolve(false);
                    
                }

                if (Date.now() / 1000 - row.lastUsed > config.device_token_timeout / 1000) {
                    resolve(false);
                        db.run('UPDATE device_tokens SET revoked = true WHERE token = ?', token, function (err: Error | null, row: unknown) { // TODO: This should be done by some background process that revokes "expired" tokens every half hour or smth (or faster if DEVICE_TOKEN_TIMEOUT is small)
                        if (err) {
                            console.error(err);
                        }
                    });
                } else {
                        resolve(row.revokedAt == null);
                };
                reject("Reached unreachable code for this promise")
            });
        });
    },
        async updateLastUsed(token: string) {
        // Ensure we do not modify data from revoked tokens
            db.run('UPDATE device_tokens SET lastUsed = unixepoch("now") WHERE token = ? AND revokedAt = NULL', token, function (err: Error | null, row: unknown) {
            if (err) {
                console.error(err);
            }
        });
    },
        async validateAndUpdateLastUsed(token: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
                const valid = await helpers.device_token.validate(token);
            if (valid) {
                    helpers.device_token.updateLastUsed(token);
            }
            resolve(valid);
        });
        },
    }
}