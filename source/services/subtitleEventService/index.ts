import { container, singleton } from 'tsyringe';

import { ScriptedEvent } from '../../types/scriptedStory';
import {
	broadcastSubtitleClear,
	broadcastSubtitlePost
} from '../radioService/broadcasters';
import EventService from '../eventService';
import EventQueue from '../eventService/EventQueue';

@singleton()
export default class SubtitleEventService extends EventService {
	constructor() {
		super(container.resolve(EventQueue));
	}

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
