export type ZermeloResponse = {
    response: {
        status: number;
        message: string;
        details: string;
        eventId: number;
        startRow: number;
        endRow: number;
        totalRows: number;
        data: Record<string, any>[];
    }
}

export type ZermeloResponseLiveSchedule = {
    appointments: {
        appointmentType: string; // Roosterintervaltype
        cancelled: boolean; // Uitval
        changeDescription: string; // Wijzigingen
        content: string; // Onderwerp
        creator: string; // Docent die de afspraak heeft ingepland
        end: string; //timestamp: Eindtijd
        endTimeSlot: number; //integer: Laatste lesuur
        endTimeSlotName: string; // Laatste lesuur
        groupChanged: boolean; // Lesgroep gewijzigd
        groups: string[]; // Lesgroepen
        id: number; //long: ID
        locationChanged: boolean; // Lokaal gewijzigd
        locations: string[]; // Lokalen
        online: boolean; // Online
        onlineLocationUrl: string; // Online locatie
        onlineTeachers: string[]; // Docenten online
        optional: boolean; // Optioneel
        start: string; //timestamp: Starttijd
        startTimeSlot: number; //integer: Eerste lesuur
        startTimeSlotName: string; // Eerste lesuur
        status: Record<string, any>[]; // Intervalstatussen
        subjects: string[]; // Vakken
        teacherChanged: boolean; // Docent gewijzigd
        teachers: string[]; // Docenten
        timeChanged: boolean; // Tijd gewijzigd
    }[];
    replacements: Record<string, any>[];
    status: Record<string, any>[];
    user: string;
    week: string; // ISO-week `jjjjww`
}