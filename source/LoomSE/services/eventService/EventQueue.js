import { RUN, STOP } from '../../constants/eventActions';

class EventQueue {
	constructor(events) {
		this.events = events;
		this.queue = this.build();
		this.index = 0;

		this.sort('asc');
	}

	get pending() {
		if (this.index > this.queue.length - 1) {
			return;
		}

		return this.queue[this.index];
	}

	getTimedObject(id) {
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
				action: RUN
			};

			const timedObjectOut = {
				id: i,
				time: this.events[i].out,
				action: STOP
			};

			queue.push(timedObjectIn, timedObjectOut);
		}

		return queue;
	}

	sort(type) {
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

export default EventQueue;
