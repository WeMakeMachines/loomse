import { ScriptedEvent } from '../../types/scriptedStory';
import {
	broadcastSubtitleClear,
	broadcastSubtitlePost
} from '../radioService/broadcasters';
import EventService from '../eventService';

export default class SubtitleEventService {
	private eventService: EventService | null = null;

	initialise(events: ScriptedEvent[]) {
		this.eventService = new EventService({
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
