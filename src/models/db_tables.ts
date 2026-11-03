export type device_token = {
    id: number; //INTEGER PRIMARY KEY AUTOINCREMENT,
    token: string; // TEXT,
    issuedAt: number, //INTEGER, -- Unix epoch timestamp
    lastUsed: number,  //INTEGER
}