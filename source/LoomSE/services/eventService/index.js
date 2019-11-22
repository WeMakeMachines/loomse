import EventQueue from './EventQueue';
import { radioService } from '../';
import { VIDEO_TIMEUPDATE } from '../../constants/videoEvents';
import { RUN, STOP } from '../../constants/eventActions';
import { secondsToMilliseconds } from '../../lib/time';

class EventServiceError extends Error {}

class EventService {
	constructor({ events, startEventCallback, stopEventCallback }) {
		this.queue = new EventQueue(events);
		this.startEventCallback = startEventCallback;
		this.stopEventCallback = stopEventCallback;

		this.tokenTimeUpdate = radioService.register(
			VIDEO_TIMEUPDATE,
			this.isReadyToAction,
			this
		);
	}

	unRegister() {
		radioService.unRegister(this.tokenTimeUpdate);
	}

	isReadyToAction(event) {
		if (!event.time) {
			return;
		}

		const time = secondsToMilliseconds(event.time);

		if (!time || !this.queue.pending) {
			return;
		}

		if (time >= this.queue.pending.time) {
			this.parseAction(this.queue.pending);
		}
	}

	parseAction(event) {
		const eventData = this.queue.events[event.id];

		if(!eventData) {
			throw new EventServiceError('Event data not found');
		}

		switch (event.action) {
			case RUN:
				this.startEventCallback(eventData);

				break;
			case STOP:
				this.stopEventCallback(eventData);

				break;
			default:
				return;
		}

		this.queue.advance();
	}
}

export const eventService = parameters => new EventService(parameters);
