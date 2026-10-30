export type Lesson = {
    id: number; // Provider-dependent ID

    subjects: string[];
    
    changeDescription: string;

    locationChanged: boolean;
    locations: string[];
    
    teacherChanged: boolean;
    teachers: string[];
    
    groupChanged: boolean;
    groups: string[];

    timeChanged: boolean;
    start: Date;
    end: Date;
    startTimeSlot: number;
    startTimeSlotName: string;
    endTimeSlot: number;
    endTimeSlotName: string; 

    cancelled: boolean;
}

export type Timetable = {
    user_id: string;
    provider: string;
    lessons: Lesson[];
}

export type User = {
    user_id: string;
    provider: string;
    email: string;
    first_name: string;
}

export interface Provider {
    getUser(user_id: string): Promise<User | undefined>;
    getTimetable(user_id: string, date?: Date): Promise<Timetable | undefined>;
}