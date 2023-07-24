import { container, singleton } from 'tsyringe';

import { StoryEvent } from '../../types/StoryType';
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

	public setEvents(events: StoryEvent[]) {
		super.setEvents(events);
	}

	protected startEventCallback({ payload }: StoryEvent) {
		broadcastSubtitlePost(payload);
	}

	protected stopEventCallback() {
		broadcastSubtitleClear();
	}
}
