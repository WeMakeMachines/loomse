import { secondsToMilliseconds } from '../../lib/time';
import { StoryEvent } from '../../types/StoryType';
import {
	listenToVideoTimeUpdate,
	StopListeningFunction
} from '../radioService/listeners';
import EventQueue, { TimedObject, EventAction } from './EventQueue';

class EventServiceError extends Error {}

export default abstract class EventService {
	public stopListeningToRadio: StopListeningFunction = () => {};
	public events: StoryEvent[] = [];

	protected constructor(private queue: EventQueue) {}

	protected setEvents(events: StoryEvent[]) {
		this.events = events;
		this.queue.setQueue(EventQueue.buildQueueFromScriptedEvents(events));
		this.stopListeningToRadio = listenToVideoTimeUpdate((time) =>
			this.isReadyToAction(time)
		);
	}

	protected abstract startEventCallback(scriptedEvent: StoryEvent): void;

	protected abstract stopEventCallback(scriptedEvent: StoryEvent): void;

	private isReadyToAction(time: number) {
		if (!time) {
			return;
		}

		const milliseconds = secondsToMilliseconds(time);
		const pending = this.queue.getPendingObject();

		if (!milliseconds || !pending) {
			return;
		}

		if (milliseconds >= pending.time) {
			this.parseAction(pending);
		}
	}

	private parseAction(event: TimedObject) {
		const eventId = this.queue.getCurrentTimedEventId();
		const eventData = this.events[eventId];

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

		this.queue.advanceQueue();
	}
}
