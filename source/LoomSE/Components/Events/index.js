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

	start({ group, payload }) {
		radioService.broadcast(DIRECTOR_SCENE_EVENT, {
			group,
			action: START,
			payload
		});
	}

	stop({ group, payload }) {
		radioService.broadcast(DIRECTOR_SCENE_EVENT, {
			group,
			action: STOP,
			payload
		});
	}

	unRegister() {
		this.events.unRegister();
	}
}

export default Events;
