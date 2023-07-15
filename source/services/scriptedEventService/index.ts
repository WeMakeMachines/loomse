import { eventService, EventServiceType } from '../eventService';
import { EventAction } from '../eventService/EventQueue';
import { broadcastDirectorSceneEvent } from '../radioService/broadcast';
import { ScriptedEvent } from '../../types/scriptedStory';

class ScriptedEventService {
	public eventService: EventServiceType | null = null;

	initialise(events: ScriptedEvent[]) {
		this.eventService = eventService({
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
		if (!this.eventService) {
			return;
		}

		this.eventService.stopListeningToRadio();
	}
}

export const scriptedEventService = new ScriptedEventService();
