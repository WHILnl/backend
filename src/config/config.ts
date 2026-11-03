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
    device_token_timeout: number;

    school_id: number | undefined;
    school_year_id: number | undefined;

    student_cache_time: number;
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
    device_token_timeout: parse(process.env.DEVICE_TOKEN_TIMEOUT) || 60 * 60 * 24 * 31, // 1 month (31 days) in seconds

    school_id: Number(process.env.SCHOOL_ID),
    school_year_id: Number(process.env.SCHOOL_YEAR_ID),

    student_cache_time: 30 * 60 * 1000,
};
console.log(config.device_token_timeout);

export default config;