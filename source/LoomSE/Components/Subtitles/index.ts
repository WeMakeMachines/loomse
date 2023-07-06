import { EventService, eventService } from '../../services/eventService';
import { ScriptedEvent } from '../../types/scriptedStory';

export default class Subtitles {
	public events: EventService;

	constructor(events: ScriptedEvent[]) {
		this.events = eventService({
			events,
			startEventCallback: this.runCallback,
			stopEventCallback: this.stopCallback
		});
	}

	runCallback(event: ScriptedEvent) {
		console.log('subtitle on');
	}

	stopCallback(event: ScriptedEvent) {
		console.log('subtitle off');
	}
}
