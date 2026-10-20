import dotenv from 'dotenv';
import parse from 'parse-duration';

dotenv.config();

interface Config {
    version: string;
    port: number;

    provider: string;
    secret: string;

    admin_username: string;
    admin_password: string;
    admin_session_duration: number;

    enroll_code_duration: number;
}

const config: Config = {
    version: process.env.VERSION!,
    port: Number(process.env.PORT)!,

    provider: process.env.PROVIDER!,
    secret: process.env.SECRET!,

    admin_username: process.env.ADMIN_USER!,
    admin_password: process.env.ADMIN_PASSWORD!,
    admin_session_duration: parse(process.env.ADMIN_SESSION_DURATION)!,

    enroll_code_duration: parse(process.env.ENROLL_CODE_DURATION)!,
};

export default config;