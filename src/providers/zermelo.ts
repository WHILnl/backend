import config from '../config/config.ts';
import type { Lesson, Timetable, Provider, User } from '../models/models.ts';
import type { ZermeloResponseLiveSchedule, ZermeloResponseStudents } from "./zermelo_types.ts";

function getISOWeek(date?: Date) {
    const d: Date = new Date();
    if (date) { d.setTime(date.getTime()) }
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
function log(...data: any[]) {
    console.log("[ZermeloProvider]", ...data)
}

export class ZermeloProvider implements Provider {
    protected token: string;
    protected baseURL: string;
    protected initialised: boolean = false;
    protected schoolYearId: number | undefined;

    protected studentsLastUpdated: number = 0;
    protected students: User[] = [];

    static provider = "zermelo";

    public get isInitialised() { return this.initialised }

    readonly requiredPermissions: any[] = [
        {
            "endpoint": "students",
            "filterFields": [
                "fields",
                "schoolInSchoolYear",
                "userCode"
            ],
            "writeFields": [],
            "readFields": [
                "firstName",
                "email",
                "userCode"
            ]
        },
        {
            "endpoint": "liveschedule",
            "filterFields": [
                "week",
                "student",
                "fields",
                "schoolInSchoolYear"
            ],
            "writeFields": [],
            "readFields": [
                "appointments",
                "week",
                "replacements",
                "user",
                "status"
            ]
        }
    ]

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
        log(`using baseURL '${this.baseURL}'`)
    }
    async init() {
        log("Initialising")

        // Verify all required permisions are available
        const res = await this.getApi("partners/~me");
        if (res.status != 200) {
            throw Error(`Received non-200 response from partners/~me endpoint: HTTP ${res.status}: ${res.message}`)
        }
        const data = res.data[0];
        log(`Using token '${data.name}' expiring at ${data.token.expirationDate}`);
        const endpointsLookup: Record<string, Record<string, string | string[]>> = {}
        for (let endpoint of data.endpoints as Record<string, string | string[]>[]) {
            endpointsLookup[endpoint.endpoint as string] = endpoint;
        }
        for (let permission of this.requiredPermissions) {
            if (endpointsLookup[permission.endpoint] == undefined) {
                throw Error(`Token requires permissions to endpoint '${permission.endpoint}'. Required:
                    filterFields: ${permission.filterFields.join(",")}
                    writeFields: ${permission.writeFields.join(",")}
                    readFields: ${permission.readFields.join(",")}`);
            }
            const granted: Record<string, string | string[]> = endpointsLookup[permission.endpoint]!;
            if (!(
                (permission.filterFields.every((perm: string) => granted.filterFields?.includes(perm))) &&
                (permission.writeFields.every((perm: string) => granted.writeFields?.includes(perm))) &&
                (permission.readFields.every((perm: string) => granted.readFields?.includes(perm)))
            )) {
                throw Error(`Token requires permissions to endpoint '${permission.endpoint}'. Required:
                    filterFields: ${permission.filterFields.join(",")}
                    writeFields: ${permission.writeFields.join(",")}
                    readFields: ${permission.readFields.join(",")}`);
            }
        }
        log("All required permissions granted");

        // Get the schoolYear for the schoolInSchoolYears query param
        const currentYear = new Date().getFullYear();
        let schoolYears: Record<string, any>[] = data.schoolInSchoolYears;
        if (config.school_id) {
            schoolYears = schoolYears.filter(it => it.school.id == config.school_id)
            if (schoolYears.length == 0) {
                throw Error(`No access to a school with id ${config.school_id} or it does not exist`)
            }
        }
        if (config.school_year_id) {
            schoolYears = schoolYears.filter(it => it.id == config.school_year_id);
            if (schoolYears.length == 0) {
                throw Error(`No access to a school year with id ${config.school_year_id} or it does not exist`)
            }
        }
        if (schoolYears.length > 1) {
            schoolYears = schoolYears.filter(it => it.schoolYear == currentYear);
            log(`School year ambiguous, filtering by current year to resolve ambiguity`)
        }
        if (schoolYears.length > 1) {
            throw Error(`Access to multiple (${schoolYears.length}) school years with this years date. Add SCHOOl_ID or SCHOOL_YEAR_ID to resolve this ambiguity`)
        }
        if (schoolYears.length == 0) {
            throw Error("No school year available to use.")
        }
        const schoolYear = schoolYears[0]!
        log(`Using school year '${schoolYear.schoolYear}' (id:${schoolYear.id}) for school '${schoolYear.school.name}' (id:${schoolYear.school.id})`)
        this.schoolYearId = schoolYear.id;

        this.initialised = true;
    }

    protected async getApi(endpoint: string) {
        const url = `${this.baseURL}/api/${endpoint}`;
        log(`GET ${url}`)
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const json = await res.json();
        return json.response;
    }

    async getTimetable(user_id: string, date?: Date): Promise<Timetable | undefined> {
        if (!this.initialised) { throw Error("ZermeloProvider not initialised") }
        date = date == undefined ? new Date() : date;

        const res = await this.getApi(`liveschedule?fields=appointments,replacements,status,user,week&week=${getISOWeek(date)}&student=${user_id}&schoolInSchoolYear=${this.schoolYearId}`);
        if (res.status == 404) {
            return;
        }
        if (res.status != 200) {
            throw Error(`Received non-200 response when getting liveschedule for user ${user_id}: HTTP ${res.status}: ${res.message}`);
        }
        const data = res.data[0] as ZermeloResponseLiveSchedule;
        let lessons: Lesson[] = [];
        for (let appointment of data.appointments) {
            const start = new Date(appointment.start * 1000);
            const end = new Date(appointment.end * 1000);

            if (date.toDateString() != start.toDateString() || date.toDateString() != end.toDateString()) {
                continue
            }
            if (appointment.id == null) {
                continue
            }

            lessons.push({
                id: appointment.id,
                subjects: appointment.subjects,
                changeDescription: appointment.changeDescription,
                locationChanged: appointment.locationChanged,
                locations: appointment.locations,
                teacherChanged: appointment.teacherChanged,
                teachers: appointment.teachers,
                groupChanged: appointment.groupChanged,
                groups: appointment.groups,
                timeChanged: appointment.timeChanged,
                start: start,
                end: end,
                startTimeSlot: appointment.startTimeSlot,
                startTimeSlotName: appointment.startTimeSlotName,
                endTimeSlot: appointment.endTimeSlot,
                endTimeSlotName: appointment.endTimeSlotName,
                cancelled: appointment.cancelled,
            });
        }
        let timetable: Timetable = {
            provider: "zermelo",
            user_id: data.user,
            lessons: lessons
        }
        return timetable;
    }
    async getUser(user_id: string): Promise<User | undefined> {
        if (!this.initialised) { throw Error("ZermeloProvider not initialised") }

        if (Date.now() - this.studentsLastUpdated >= config.student_cache_time) {
            const res = await this.getApi(`students?fields=email,firstName,userCode&schoolInSchoolYear=${this.schoolYearId}`);
            if (res.status != 200) {
                throw Error(`Received non-200 response when getting liveschedule for user ${user_id}: HTTP ${res.status}: ${res.message}`);
            }
            let users: User[] = (res.data as ZermeloResponseStudents[])
                .map(data => {
                    return {
                        user_id: data.userCode,
                        provider: "zermelo",
                        email: data.email,
                        first_name: data.firstName,
                    }
                });
            this.students = users;
            this.studentsLastUpdated = Date.now();
        }

        const students = this.students.filter(s => s.user_id == user_id);
        if (students.length > 1) {
            throw Error("Multiple users with the same user id")
        }
        return students[0];
    }
}