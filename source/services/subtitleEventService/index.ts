import { container, singleton } from 'tsyringe';

import { SceneEvent } from '../../types/StoryType';
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

	protected startEventCallback({ payload }: SceneEvent) {
		if (payload) {
			broadcastSubtitlePost(payload);
		}
	}

	protected stopEventCallback() {
		broadcastSubtitleClear();
	}
}
