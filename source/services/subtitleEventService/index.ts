import { eventService, EventServiceType } from '../eventService';
import {
	broadcastSubtitleClear,
	broadcastSubtitlePost
} from '../radioService/broadcast';
import { ScriptedEvent } from '../../types/scriptedStory';

class SubtitleEventService {
	public eventService: EventServiceType | null = null;

	initialise(events: ScriptedEvent[]) {
		this.eventService = eventService({
			events,
			startEventCallback: this.start,
			stopEventCallback: this.stop
		});
	}

	start({ payload }: ScriptedEvent) {
		broadcastSubtitlePost(payload);
	}

	stop() {
		broadcastSubtitleClear();
	}

	stopListeningToRadio() {
		if (!this.eventService) {
			return;
		}

		this.eventService.stopListeningToRadio();
	}
}

export const subtitleEventService = new SubtitleEventService();
