import type { Lesson, Timetable, Provider } from "@/types.d.ts";
import providers from "./providers.ts";

export default class ZermeloProvider implements Provider {
    static Name = "zermelo"
    getName(): string {
        return ZermeloProvider.Name
    }
    getTimetable(string: any): Timetable {
        return {
            week: "202641",
            user: "world",
            lessons: [],
        }
    }
}

providers.register(ZermeloProvider)