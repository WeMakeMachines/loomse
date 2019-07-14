import Component from '../Abstract';

import { Queue } from '../../Models';

import { RUN, STOP } from '../../../constants/eventActions';

import { secondsToMilliseconds } from '../../tools';

import { radio } from '../../../services';

export class TimedComponent extends Component {
	constructor(id, styles, events) {
		super({
			id,
			styles
		});

		this.activeEvents = {};
		this.queue = new Queue(events);

		this.listenToRadio();
	}

	listenToRadio() {
		radio.listen('video:timeupdate', payload => {
			if (payload.time) {
				const time = secondsToMilliseconds(payload.time);

				this.isReadyToAction(time);
			}
		});
	}

	isReadyToAction(time) {
		if (!time || !this.queue.pending) {
			return;
		}

		if (time >= this.queue.pending.time) {
			this.parseAction(this.queue.pending);
		}
	}

	parseAction(event) {
		switch (event.action) {
			case RUN:
				this.run(event);

				break;
			case STOP:
				this.stop(event);

				break;
			default:
				return;
		}

		this.queue.advance();
	}

	run() {}

	stop() {}
}
