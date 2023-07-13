import { EventService, eventService } from '../../services/eventService';
import { Event, EventAction } from '../../services/eventService/EventQueue';
import { broadcastDirectorSceneEvent } from '../../services/radioService/broadcast';

export default class Events {
	public events: EventService;

	constructor(events: Event[]) {
		this.events = eventService({
			events,
			startEventCallback: this.start,
			stopEventCallback: this.stop
		});
	}

	start({ payload }: Event) {
		broadcastDirectorSceneEvent({
			action: EventAction.START,
			payload
		});
	}

	stop({ payload }: Event) {
		broadcastDirectorSceneEvent({
			action: EventAction.STOP,
			payload
		});
	}

	unRegister() {
		this.events.unRegister();
	}
}
