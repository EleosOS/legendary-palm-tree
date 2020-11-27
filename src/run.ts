import { Bot, changeRecringeHue } from './Modules/Bot';
import { Signale } from './Modules/Signale';

void (async () => {
	await Bot.run();
	Signale.start({prefix: 'startup', message: 'Bot ready'});

	const hueTrigger = new Date();
	const now = new Date();

	hueTrigger.setDate(now.getDate() + 1);
	hueTrigger.setHours(0);
	hueTrigger.setMinutes(0);
	hueTrigger.setSeconds(0);
	hueTrigger.setMilliseconds(0);

	setTimeout(() => {
		void changeRecringeHue(10);
		setInterval(() => void changeRecringeHue(10), 86400000);
	}, hueTrigger.getTime() - now.getTime());
})();