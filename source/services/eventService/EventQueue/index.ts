import { ScriptedEvent } from '../../../types/scriptedStory';

export interface TimedObject {
	id: number;
	time: number;
	action: EventAction;
}

export enum EventAction {
	START = 'start',
	STOP = 'stop'
}

export default class EventQueue {
	private queueIndex = 0;
	private queue: TimedObject[] = [];

	static buildQueueFromScriptedEvents(
		events: ScriptedEvent[]
	): TimedObject[] {
		const queue: TimedObject[] = [];

		for (let i = 0; i < events.length; i += 1) {
			const timedObjectIn = {
				id: i,
				time: events[i].in,
				action: EventAction.START
			};

			const timedObjectOut = {
				id: i,
				time: events[i].out,
				action: EventAction.STOP
			};

			queue.push(timedObjectIn, timedObjectOut);
		}

		return queue;
	}

	setQueue(timedObjects: TimedObject[]) {
		this.queueIndex = 0;
		this.queue = timedObjects;
		this.sort('asc');
	}

	getQueue(): TimedObject[] {
		return this.queue;
	}

	getCurrentTimedEventId() {
		return this.queue[this.queueIndex].id;
	}

	getPendingObject(): TimedObject | undefined {
		if (this.queueIndex > this.queue.length - 1) {
			return;
		}

		return this.queue[this.queueIndex];
	}

	advanceQueue() {
		this.queueIndex += 1;
	}

	sort(type: 'desc' | 'asc') {
		switch (type) {
			case 'desc':
				this.queue.sort((a, b) => b.time - a.time);
				break;

			case 'asc':
			default:
				this.queue.sort((a, b) => a.time - b.time);
		}
	}
}
