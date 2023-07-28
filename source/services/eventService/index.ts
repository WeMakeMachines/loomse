import { SceneEvent } from '../../types/StoryType';
import {
	listenToVideoTimeUpdate,
	StopListeningFunction
} from '../radioService/listeners';
import EventQueue, { EventAction } from './EventQueue';

class EventServiceError extends Error {}

export default abstract class EventService {
	public events: SceneEvent[] = [];

	protected stopListeningToRadio: StopListeningFunction = () => {};
	protected constructor(private queue: EventQueue) {}

	public setEvents(events: SceneEvent[]) {
		this.events = events;
		this.queue.setQueue(EventQueue.buildQueueFromScriptedEvents(events));
		this.stopListeningToRadio = listenToVideoTimeUpdate((time) => {
			const actionableEvent = this.getCurrentlyActionableEvent(time);

			if (actionableEvent) {
				this.actionEvent(actionableEvent);
			}
		});
	}

	protected abstract startEventCallback(scriptedEvent: SceneEvent): void;

	protected abstract stopEventCallback(scriptedEvent: SceneEvent): void;

	private getCurrentlyActionableEvent(
		seconds: number
	): { event: SceneEvent; action: EventAction } | undefined {
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
		event: SceneEvent;
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

	public resetService() {
		this.stopListeningToRadio();
		this.events = [];
		this.queue.reset();
	}
}
