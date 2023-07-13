import { EventService, eventService } from '../../services/eventService';
import { Event } from '../../services/eventService/EventQueue';

export default class Subtitles {
	public events: EventService;

	constructor(events: Event[]) {
		this.events = eventService({
			events,
			startEventCallback: this.runCallback,
			stopEventCallback: this.stopCallback
		});
	}

	runCallback(event: Event) {
		console.log('subtitle on');
	}

	stopCallback(event: Event) {
		console.log('subtitle off');
	}
}
