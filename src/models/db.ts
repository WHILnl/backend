import sqlite3 from 'sqlite3';
import type { device_token, enroll_code } from './db_tables.ts';
import config from '../config/config.ts';
import crypto from 'crypto';

function generateSecureToken(length: number) {
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const alphabetLength = alphabet.length;
  const randomBytes = crypto.randomBytes(length);

  let token = '';

  for (let index = 0; index < randomBytes.length; index += 1) {
    const charIndex = randomBytes[index]! % alphabetLength;
    token += alphabet[charIndex];
  }

  return token;
}

export const db = new sqlite3.Database('sqlite.db');

db.run(
  `
    CREATE TABLE IF NOT EXISTS device_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT UNIQUE,
        issuedAt INTEGER, -- Unix epoch timestamp
        lastUsed INTEGER,  -- Unix epoch timestamp
        revokedAt INTEGER -- Unix epoch timestamp
    );
`,
  (err) => {
    if (err) {
      console.error(`Could not create table device_tokens: ${err}`);
    }
  },
);
db.run(
  `
    CREATE TABLE IF NOT EXISTS enroll_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE, -- 6 digit code
        usesRemaining INTEGER,
        issuedAt INTEGER, -- Unix epoch timestamp
        validUntil INTEGER -- Unix epoch timestamp
    );
`,
  (err) => {
    if (err) {
      console.error(`Could not create table enroll_codes: ${err}`);
    }
  },
);
  db.run(
    `
    CREATE TRIGGER IF NOT EXISTS prevent_revoked_at_unset
      BEFORE UPDATE OF revokedAt ON device_tokens
      WHEN OLD.revokedAt IS NOT NULL AND
        OLD.revokedAt != NEW.revokedAt
      BEGIN
      	SELECT
        	RAISE (ABORT, 'device_tokens.revokedAt may not be set more than once');
      END;
`,
    (err) => {
      if (err) {
        console.error(
        `Could not create trigger prevent_revoked_at_unset_on_device_tokens: ${err}`,
        );
      }
    },
);

export const helpers = {
  device_token: {
    async validate(token: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        db.get(
          'SELECT * FROM device_tokens WHERE token = ?',
          token,
          function (err, row: device_token) {
            if (err) {
              console.error(err);
              return reject();
            }
            if (row == undefined) {
              return resolve(false);
            }

            if (
              Date.now() / 1000 - row.lastUsed >
              config.device_token_timeout / 1000
            ) {
              resolve(false);
              db.run(
                'UPDATE device_tokens SET revoked = true WHERE token = ?',
                token,
                function (err: Error | null, row: unknown) {
                  // TODO: This should be done by some background process that revokes "expired" tokens every half hour or smth (or faster if DEVICE_TOKEN_TIMEOUT is small)
                  if (err) {
                    console.error(err);
                  }
                },
              );
            } else {
              resolve(row.revokedAt == null);
            }
            reject('Reached unreachable code for this promise');
          },
        );
      });
    },
    async updateLastUsed(token: string) {
      // Ensure we do not modify data from revoked tokens
      db.run(
        'UPDATE device_tokens SET lastUsed = unixepoch("now") WHERE token = ? AND revokedAt = NULL',
        token,
        function (err: Error | null, row: unknown) {
          if (err) {
            console.error(err);
          }
        },
      );
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

    async generate(): Promise<device_token> {
      return new Promise(async (resolve, reject) => {
        const token = generateSecureToken(config.device_token_length);
        db.run(
          'INSERT INTO device_tokens (token, issuedAt, lastUsed) VALUES (?, unixepoch("now"), unixepoch("now"));',
          token,
          function (err: Error | null) {
            if (err) {
              console.error(err);
              return reject();
            }
            db.get(
              'SELECT * FROM device_tokens WHERE token = ? AND id = ?',
              [token, this.lastID],
              function (err, row: device_token) {
                if (err) {
                  console.error(err);
                  return reject();
                }
                if (row == undefined) {
                  console.error(err);
                  return reject();
                }
                return resolve(row);
              },
            );
          },
        );
      });
    },
  },
  enroll_code: {
    async validate(code: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        if (code.length != config.enroll_code_length) {
          resolve(false);
        }

        db.get(
          'SELECT * FROM enroll_codes WHERE code = ? AND usesRemaining != 0',
          code,
          function (err, row: enroll_code) {
            if (err) {
              console.error(err);
              return reject();
            }
            if (row == undefined) {
              return resolve(false);
            }

            resolve(Date.now() / 1000 < row.validUntil);
          },
        );
      });
    },
    async redeem(code: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        db.run(
          `UPDATE enroll_codes 
                    SET usesRemaining = CASE
                        WHEN usesRemaining = -1 THEN -1
                        ELSE usesRemaining - 1 
                    END
                    WHERE code = ? AND (usesRemaining > 0 OR usesRemaining = -1) AND validUntil > ?`,
          [code, Date.now() / 1000],
          function (err) {
            if (err) {
              console.error(err);
              return reject(err);
            }
            resolve(this.changes > 0);
          },
        );
      });
    },
  },
};
