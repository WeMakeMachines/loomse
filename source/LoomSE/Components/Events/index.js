import { eventService } from '../../services';

class Events {
	constructor(events) {
		this.events = eventService({
			events,
			startEventCallback: this.start,
			stopEventCallback: this.stop
		});
	}

	start(message) {
		console.log('on');
	}

	stop(message) {
		console.log('off');
	}
}

export default Events;
