import { EventService, eventService } from '../../services/eventService';
import { radioService } from '../../services/radioService';
import { DirectorEvent } from '../../types/media';
import { EventAction } from '../../types/events';
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
		radioService.broadcast(DirectorEvent.SCENE_EVENT, {
			action: EventAction.START,
			payload
		});
	}

	stop({ payload }: ScriptedEvent) {
		radioService.broadcast(DirectorEvent.SCENE_EVENT, {
			action: EventAction.STOP,
			payload
		});
	}

	unRegister() {
		this.events.unRegister();
	}
}
