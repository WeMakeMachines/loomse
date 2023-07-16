import { secondsToMilliseconds } from '../../lib/time';
import { ScriptedEvent } from '../../types/scriptedStory';
import {
	listenToVideoTimeUpdate,
	StopListeningFunction
} from '../radioService/listeners';
import EventQueue, { TimedObject, EventAction } from './EventQueue';

class EventServiceError extends Error {}

interface EventServiceProps {
	events: ScriptedEvent[];
	startEventCallback: (event: ScriptedEvent) => void;
	stopEventCallback: (event: ScriptedEvent) => void;
}

class EventService {
	public queue: EventQueue;

	private readonly startEventCallback: (event: ScriptedEvent) => void;
	private readonly stopEventCallback: (event: ScriptedEvent) => void;
	private readonly stopListeningToTimeUpdate: StopListeningFunction;

	constructor({
		events,
		startEventCallback,
		stopEventCallback
	}: EventServiceProps) {
		this.queue = new EventQueue(events);
		this.startEventCallback = startEventCallback;
		this.stopEventCallback = stopEventCallback;

		this.stopListeningToTimeUpdate = listenToVideoTimeUpdate((time) =>
			this.isReadyToAction(time)
		);
	}

	stopListeningToRadio() {
		this.stopListeningToTimeUpdate();
	}

	isReadyToAction(time: number) {
		if (!time) {
			return;
		}

		const milliseconds = secondsToMilliseconds(time);
		const pending = this.queue.getPending();

		if (!milliseconds || !pending) {
			return;
		}

		if (milliseconds >= pending.time) {
			this.parseAction(pending);
		}
	}

	parseAction(event: TimedObject) {
		const eventData = this.queue.getEvent(event.id);

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

export type EventServiceType = EventService;

export const eventService = (parameters: EventServiceProps) =>
	new EventService(parameters);
