import type { Lesson, Timetable, Provider, User } from '../models/models.ts';
import type { ZermeloResponseLiveSchedule } from "./zermelo_types.ts";

function getISOWeek() {
    const d: Date = new Date();
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart: Date = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    // Return array of year and week number
    return d.getUTCFullYear().toString() + weekNo.toString();
}


export class ZermeloProvider implements Provider {
    protected token: string;
    protected baseURL: string;
    static provider = "zermelo";

    constructor(secret: string) {
        if (secret == null || secret == undefined) {
            throw Error(".env SECRET is required for PROVIDER 'zermelo'. Use format 'baseURL|apiToken'")
        }
        const match = secret.match(/^([^|]+)\|(.+)$/);
        if (match == null || match[1] == undefined || match[2] == undefined) {
            throw Error(".env SECRET must follow format 'baseURL|apiToken' | " + secret);
        }
        this.baseURL = match[1];
        this.token = match[2];
        console.log(`ZermeloProvider using baseURL '${this.baseURL}'`)
    }

    protected async getApi(endpoint: string) {
        const url = `${this.baseURL}/api/${endpoint}`;
        console.log(`GET ${url}`)
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const json = await res.json();
        return json;
    }

    async getTimetable(user_id: string): Timetable | undefined {

        const body = await this.getApi(`liveschedule?fields=appointments,replacements,status,user,week&week=${getISOWeek()}&student=${user_id}`);
        console.log(body);
    }
    async getUser(user_id: string): User | undefined {
        throw new Error('Method not implemented.');
    }
}