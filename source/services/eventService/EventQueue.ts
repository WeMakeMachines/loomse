import { ScriptedEvent } from '../../types/scriptedStory';

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
	public index = 0;

	public events: ScriptedEvent[];
	public queue: TimedObject[];

	constructor(events: ScriptedEvent[]) {
		this.events = events;
		this.queue = this.build();

		this.sort('asc');
	}

	get pending() {
		if (this.index > this.queue.length - 1) {
			return;
		}

		return this.queue[this.index];
	}

	getTimedObject(id: number) {
		return this.events[id];
	}

	advance() {
		this.index += 1;
	}

	build() {
		const queue = [];

		for (let i = 0; i < this.events.length; i += 1) {
			const timedObjectIn = {
				id: i,
				time: this.events[i].in,
				action: EventAction.START
			};

			const timedObjectOut = {
				id: i,
				time: this.events[i].out,
				action: EventAction.STOP
			};

			queue.push(timedObjectIn, timedObjectOut);
		}

		return queue;
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
