import { ScriptedEvent } from '../../types/scriptedStory';
import {
	broadcastSubtitleClear,
	broadcastSubtitlePost
} from '../radioService/broadcasters';
import EventService from '../eventService';

export default class SubtitleEventService extends EventService {
	public setEvents(events: ScriptedEvent[]) {
		super.setEvents(events);
	}

	protected startEventCallback({ payload }: ScriptedEvent) {
		broadcastSubtitlePost(payload);
	}

	protected stopEventCallback() {
		broadcastSubtitleClear();
	}
}
