import { RUN, STOP } from '../constants/eventActions';

export class Queue {
	constructor(timedObjects) {
		this._timedObjects = timedObjects;
		this._queue = this.build();
		this._index = 0;

		this.sort('asc');
	}

	get pending() {
		if (this._index > this._queue.length - 1) {
			return;
		}

		return this._queue[this._index];
	}

	getTimedObject(id) {
		return this._timedObjects[id];
	}

	advance() {
		this._index += 1;
	}

	build() {
		const queue = [];

		for (let i = 0; i < this._timedObjects.length; i += 1) {
			const timedObjectIn = {
				id: i,
				time: this._timedObjects[i].in,
				action: RUN
			};

			const timedObjectOut = {
				id: i,
				time: this._timedObjects[i].out,
				action: STOP
			};

			queue.push(timedObjectIn, timedObjectOut);
		}

		return queue;
	}

	sort(type) {
		switch (type) {
			case 'desc':
				this._queue.sort((a, b) => b.time - a.time);
				break;

			case 'asc':
			default:
				this._queue.sort((a, b) => a.time - b.time);
		}
	}
}
