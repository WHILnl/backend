import app from './app.ts';
import config from './config/config.ts';
import provider from './providers/providers.ts';

console.log(`Using provider '${config.provider}'`);

console.log(`The current time is ${new Date()}
\tUTC: ${new Date().toUTCString()}
\tEpoch: ${Date.now()} ms`);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
