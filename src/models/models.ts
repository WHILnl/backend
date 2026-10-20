export interface Lesson {
    name: string;
    location: string;
    teacher: string;
    time: Date;
}

export interface Timetable {
    user_id: string;
    provider: string;
    lessons: Lesson[];
}

export interface User {
    user_id: string;
    first_name: string;
}

export interface Provider {
    getUser(user_id: string): User | undefined;
    getTimetable(user_id: string): Timetable | undefined;
}