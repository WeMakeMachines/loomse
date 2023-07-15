import { secondsToMilliseconds } from '../../lib/time';
import { ScriptedEvent } from '../../types/scriptedStory';
import { listenToVideoTimeUpdate } from '../radioService/listenTo';
import { radio } from '../radioService/radio';
import EventQueue, { TimedObject, EventAction } from './EventQueue';

class EventServiceError extends Error {}

interface EventServiceProps {
	events: ScriptedEvent[];
	startEventCallback: (event: ScriptedEvent) => void;
	stopEventCallback: (event: ScriptedEvent) => void;
}

export class EventService {
	public queue: EventQueue;

	private readonly listenerToken: string;
	private readonly startEventCallback: (event: ScriptedEvent) => void;
	private readonly stopEventCallback: (event: ScriptedEvent) => void;

	constructor({
		events,
		startEventCallback,
		stopEventCallback
	}: EventServiceProps) {
		this.queue = new EventQueue(events);
		this.startEventCallback = startEventCallback;
		this.stopEventCallback = stopEventCallback;

		this.listenerToken = listenToVideoTimeUpdate((time) =>
			this.isReadyToAction(time)
		);
	}

	stopListeningToRadio() {
		radio.stopListening(this.listenerToken);
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
