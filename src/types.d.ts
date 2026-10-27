export interface Provider {
    getName(): string;
    getTimetable(string): Timetable;
}

export type Lesson = {
    id: number
    start: Date
    end: Date
    startTimeSlot: number
    endTimeSlot: number
    subjects: string[]
    groups: string[]
    locations: string[]
    teachers: string[]
    changes: {
        teacher: boolean
        location: boolean
        group: boolean
        time: boolean
    }
    lastModified: Date
}

export type ISOWeek = {
    year: number
    week: number
} | string

export type Timetable = {
    week: ISOWeek
    user: string
    lessons: Lesson[]
}

export enum Status {
    OK = 200,
    Created = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500,
}

export type Response<T> = {
    status: Status,
    data: T,
}