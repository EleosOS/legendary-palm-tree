import { Bot } from './Modules/Bot';
import { Signale } from './Modules/Signale';

void (async () => {
	await Bot.run();
	Signale.start({prefix: 'startup', message: 'Bot ready'});
})();