import { EventService, eventService } from '../../services/eventService';
import { radioService } from '../../services/radioService';
import { Event, EventAction } from '../../services/eventService/EventQueue';
import { RadioChannel } from '../../types/radioChannels';

export default class Events {
	public events: EventService;

	constructor(events: Event[]) {
		this.events = eventService({
			events,
			startEventCallback: this.start,
			stopEventCallback: this.stop
		});
	}

	start({ payload }: Event) {
		radioService.broadcastOnChannel(RadioChannel.DIRECTOR_SCENE_EVENT, {
			action: EventAction.START,
			payload
		});
	}

	stop({ payload }: Event) {
		radioService.broadcastOnChannel(RadioChannel.DIRECTOR_SCENE_EVENT, {
			action: EventAction.STOP,
			payload
		});
	}

	unRegister() {
		this.events.unRegister();
	}
}
