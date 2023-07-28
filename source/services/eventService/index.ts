import { StoryEvent } from '../../types/StoryType';
import {
	listenToVideoTimeUpdate,
	StopListeningFunction
} from '../radioService/listeners';
import EventQueue, { EventAction } from './EventQueue';

class EventServiceError extends Error {}

export default abstract class EventService {
	public stopListeningToRadio: StopListeningFunction = () => {};
	public events: StoryEvent[] = [];

	protected constructor(private queue: EventQueue) {}

	public setEvents(events: StoryEvent[]) {
		this.events = events;
		this.queue.setQueue(EventQueue.buildQueueFromScriptedEvents(events));
		this.stopListeningToRadio = listenToVideoTimeUpdate((time) => {
			const actionableEvent = this.getCurrentlyActionableEvent(time);

			if (actionableEvent) {
				this.actionEvent(actionableEvent);
			}
		});
	}

	protected abstract startEventCallback(scriptedEvent: StoryEvent): void;

	protected abstract stopEventCallback(scriptedEvent: StoryEvent): void;

	private getCurrentlyActionableEvent(
		seconds: number
	): { event: StoryEvent; action: EventAction } | undefined {
		const pending = this.queue.getPendingObject();

		if (!pending) {
			return;
		}

		if (seconds >= pending.time) {
			const eventData = this.events[pending.id];

			if (!eventData) {
				throw new EventServiceError('Event data not found');
			}

			return { event: eventData, action: pending.action };
		}
	}

	private actionEvent({
		event,
		action
	}: {
		event: StoryEvent;
		action: EventAction;
	}) {
		switch (action) {
			case EventAction.START:
				this.startEventCallback(event);

				break;
			case EventAction.STOP:
				this.stopEventCallback(event);

				break;
			default:
				return;
		}

		this.queue.advanceQueue();
	}
}
