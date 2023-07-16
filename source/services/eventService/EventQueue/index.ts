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
	private index = 0;

	private readonly events: ScriptedEvent[];
	private readonly queue: TimedObject[];

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

	constructor(events: ScriptedEvent[]) {
		this.events = events;
		this.queue = EventQueue.buildQueueFromScriptedEvents(events);

		this.sort('asc');
	}

	getEvent(id: number): ScriptedEvent {
		return this.events[id];
	}

	getIndex() {
		return this.index;
	}

	getPending(): TimedObject | undefined {
		if (this.index > this.queue.length - 1) {
			return;
		}

		return this.queue[this.index];
	}

	getQueue(): TimedObject[] {
		return this.queue;
	}

	advance() {
		this.index += 1;
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
