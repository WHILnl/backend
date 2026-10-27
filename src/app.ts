import dotenv from "dotenv";
import express, { type Express, type Request, type Response } from 'express';

import providers from "./providers/providers.ts";
import "./providers/helloworld.ts";
import "./providers/zermelo.ts";

import versionRouter from "./routes/version.ts";
import timetableRouter from "./routes/timetable.ts";

dotenv.config();

const PORT = process.env.PORT;
const PROVIDER = process.env.PROVIDER;
if (PROVIDER == undefined) {
  throw Error("env variable PROVIDER is unset.")
}
const provider = providers.new(
  PROVIDER,
  process.env.SECRET
);

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use("/version", versionRouter(provider));
app.use("/timetable", timetableRouter(provider));

app.listen(PORT, () => console.log(`Listening on :${PORT}`));