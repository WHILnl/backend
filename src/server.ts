import app from './app.ts';
import config from './config/config.ts';
import provider from './providers/providers.ts';

console.log(`Using provider '${config.provider}'`)

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});