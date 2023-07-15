import { EventService, eventService } from '../../services/eventService';
import { EventAction } from '../../services/eventService/EventQueue';
import { broadcastDirectorSceneEvent } from '../../services/radioService/broadcast';
import { ScriptedEvent } from '../../types/scriptedStory';

export default class Events {
	public events: EventService;

	constructor(events: ScriptedEvent[]) {
		this.events = eventService({
			events,
			startEventCallback: this.start,
			stopEventCallback: this.stop
		});
	}

	start({ payload }: ScriptedEvent) {
		broadcastDirectorSceneEvent({
			action: EventAction.START,
			payload
		});
	}

	stop({ payload }: ScriptedEvent) {
		broadcastDirectorSceneEvent({
			action: EventAction.STOP,
			payload
		});
	}

	stopListeningToRadio() {
		this.events.stopListeningToRadio();
	}
}
