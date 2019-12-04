import { eventService, radioService } from '../../services';
import { START, STOP } from '../../constants/eventActions';
import { DIRECTOR_SCENE_EVENT } from '../../constants/directorEvents';

class Events {
	constructor(events) {
		this.events = eventService({
			events,
			startEventCallback: this.start,
			stopEventCallback: this.stop
		});
	}

	start({ type, payload }) {
		radioService.broadcast(DIRECTOR_SCENE_EVENT, {
			action: START,
			type,
			payload
		});
	}

	stop({ type, payload }) {
		radioService.broadcast(DIRECTOR_SCENE_EVENT, {
			action: STOP,
			type,
			payload
		});
	}
}

export default Events;
