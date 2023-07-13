import { secondsToMilliseconds } from '../../lib/time';
import { RadioChannel } from '../../types/radioChannels';
import { radioService } from '../radioService';
import EventQueue, { TimedObject, Event, EventAction } from './EventQueue';

class EventServiceError extends Error {}

interface EventServiceProps {
	events: Event[];
	startEventCallback: (event: Event) => void;
	stopEventCallback: (event: Event) => void;
}

export class EventService {
	public queue: EventQueue;
	public startEventCallback: (event: Event) => void;
	public stopEventCallback: (event: Event) => void;
	public listenerToken: string;

	constructor({
		events,
		startEventCallback,
		stopEventCallback
	}: EventServiceProps) {
		this.queue = new EventQueue(events);
		this.startEventCallback = startEventCallback;
		this.stopEventCallback = stopEventCallback;

		this.listenerToken = radioService.listenToChannel(
			RadioChannel.VIDEO_TIMEUPDATE,
			this.isReadyToAction,
			this
		);
	}

	unRegister() {
		radioService.stopListening(this.listenerToken);
	}

	isReadyToAction(time: number) {
		if (!time) {
			return;
		}

		const milliseconds = secondsToMilliseconds(time);

		if (!milliseconds || !this.queue.pending) {
			return;
		}

		if (milliseconds >= this.queue.pending.time) {
			this.parseAction(this.queue.pending);
		}
	}

	parseAction(event: TimedObject) {
		const eventData = this.queue.events[event.id];

		if (!eventData) {
			throw new EventServiceError('Event data not found');
		}

		switch (event.action) {
			case EventAction.START:
				this.startEventCallback(eventData);

				break;
			case EventAction.STOP:
				this.stopEventCallback(eventData);

				break;
			default:
				return;
		}

		this.queue.advance();
	}
}

export const eventService = (parameters: EventServiceProps) =>
	new EventService(parameters);
