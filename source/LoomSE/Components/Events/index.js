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

	start({ moduleName, payload }) {
		radioService.broadcast(DIRECTOR_SCENE_EVENT, {
			action: START,
			moduleName,
			payload
		});
	}

	stop({ moduleName, payload }) {
		radioService.broadcast(DIRECTOR_SCENE_EVENT, {
			action: STOP,
			moduleName,
			payload
		});
	}
}

export default Events;
