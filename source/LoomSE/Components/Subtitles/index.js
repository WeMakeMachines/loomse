import { eventService } from '../../services';

class Subtitles {
	constructor(events) {
		this.events = eventService({
			events,
			runCallback: this.runCallback,
			stopCallback: this.stopCallback
		});
	}

	runCallback(message) {
		console.log('subtitle on');
	}

	stopCallback(message) {
		console.log('subtitle off');
	}
}

export default Subtitles;
