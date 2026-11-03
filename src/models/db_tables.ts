export type device_token = {
  id: number; //INTEGER PRIMARY KEY AUTOINCREMENT,
  token: string; // TEXT,
  issuedAt: number; //INTEGER, -- Unix epoch timestamp
  lastUsed: number; //INTEGER
  revokedAt: number | null;
};
export type enroll_code = {
  id: number; // INTEGER PRIMARY KEY AUTOINCREMENT,
  code: number; // INTEGER, -- 6 digit code
  usesRemaining: number; // INTEGER,
  issuedAt: number; // INTEGER, -- Unix epoch timestamp
  validUntil: number; // INTEGER -- Unix epoch timestamp
};
