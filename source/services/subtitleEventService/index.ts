import { injectable } from 'tsyringe';

import { SceneEvent } from '../../types/StoryType';
import {
	broadcastSubtitleClear,
	broadcastSubtitlePost
} from '../radioService/broadcasters';
import EventService from '../eventService';

@injectable()
export default class SubtitleEventService extends EventService {
	constructor() {
		super();
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
