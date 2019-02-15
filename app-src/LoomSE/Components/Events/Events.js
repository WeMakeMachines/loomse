import Component from '../Abstract';

import { Queue } from '../../model/Queue';

import Event from '../Event';

import { RUN, STOP } from '../../../constants/eventActions';

import { secondsToMilliseconds } from '../../tools';

import { radio } from '../../../services';

export class Events extends Component {
	constructor(events) {
		super({
			id: 'events'
		});

		this.queue = new Queue(events);
		this.activeEvents = {};

		this.listenToRadio();
	}

	isReadyToAction(time) {
		if (!time || !this.queue.pending) { return; }

		if (time >= this.queue.pending.time) {
			this.actionEvent(this.queue.pending);
		}
	}

	actionEvent(event) {

		switch (event.action) {
			case RUN:
				this.activeEvents[event.id] = new Event(this.queue.getTimedObject(event.id));
				this.activeEvents[event.id].run();
				break;
			case STOP:
				this.activeEvents[event.id].stop();

				delete this.activeEvents[event.id];
				break;
			default:
				return;
		}

		this.queue.advance();
	}

	listenToRadio() {
		radio.listen('video:timeupdate', (payload) => {
			if (payload.time) {
				const time = secondsToMilliseconds(payload.time);

				this.isReadyToAction(time);
			}
		});
	}
}
