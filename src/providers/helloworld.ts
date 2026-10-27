import type { Lesson, Timetable, Provider } from "@/types.d.ts";
import providers from "./providers.ts";

export default class HelloWorldProvider implements Provider {
    static Name = "helloworld"
    getName(): string {
        return HelloWorldProvider.Name
    }
    getTimetable(string: any): Timetable {
        return {
            week: "202641",
            user: "world",
            lessons: [],
        }
    }
}

providers.register(HelloWorldProvider)