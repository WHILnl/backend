import type { Lesson, Timetable, Provider, User } from '../models/models.ts';
import { ZermeloProvider } from './zermelo.ts';
import config from "../config/config.ts";

class HelloWorldProvider implements Provider {
    protected secret: string;
    static provider = "hello_world";

    constructor(secret: string) {
        this.secret = secret;
    }

    async getTimetable(user_id: string): Promise<Timetable | undefined> {
        if (user_id == "daaag") {
            return
        }

        return {
            user_id: user_id,
            provider: HelloWorldProvider.provider,
            lessons: [],
        }
    }
    async getUser(user_id: string): Promise<User | undefined> {
        if (user_id == "daaag") {
            return
        }

        return {
            user_id: user_id,
            provider: HelloWorldProvider.provider,
            email: "",
            first_name: "Wereld",
        }
    }
}

export function newProvider(provider: string, secret: string) {
    switch (provider) {
        case HelloWorldProvider.provider:
            return new HelloWorldProvider(secret);
        case ZermeloProvider.provider:
            return new ZermeloProvider(secret);

        default:
            throw Error(`Provider ${provider} does not exist.`);
    }
}

const defaultProvider = newProvider(config.provider, config.secret)!;
if ("init" in defaultProvider) {
    await defaultProvider.init()
}
export default defaultProvider;