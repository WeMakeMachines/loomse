import EventQueue, { TimedObject } from './EventQueue';
import { radioService } from '../radioService';
import { VideoEvent } from '../../types/media';
import { secondsToMilliseconds } from '../../lib/time';
import { EventAction } from '../../types/events';
import { ScriptedEvent } from '../../types/scriptedStory';

class EventServiceError extends Error {}

interface EventServiceProps {
	events: ScriptedEvent[];
	startEventCallback: (event: ScriptedEvent) => void;
	stopEventCallback: (event: ScriptedEvent) => void;
}

export class EventService {
	public queue: EventQueue;
	public startEventCallback: (event: ScriptedEvent) => void;
	public stopEventCallback: (event: ScriptedEvent) => void;
	public radioUnregisterTokenTimeUpdate: string;

	constructor({
		events,
		startEventCallback,
		stopEventCallback
	}: EventServiceProps) {
		this.queue = new EventQueue(events);
		this.startEventCallback = startEventCallback;
		this.stopEventCallback = stopEventCallback;

		this.radioUnregisterTokenTimeUpdate = radioService.register(
			VideoEvent.TIMEUPDATE,
			this.isReadyToAction,
			this
		);
	}

	unRegister() {
		radioService.unRegister(this.radioUnregisterTokenTimeUpdate);
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
