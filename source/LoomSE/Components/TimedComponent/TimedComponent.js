import Component from '../Abstract';

import { Queue } from '../../Models';

import { VIDEO_TIMEUPDATE } from '../../../constants/applicationActions';
import { RUN, STOP } from '../../../constants/eventActions';

import { secondsToMilliseconds } from '../../tools';

export class TimedComponent extends Component {
	constructor(id, styles, events) {
		super({
			id,
			styles
		});

		this.activeEvents = {};
		this.queue = new Queue(events);

		this.listenToChannel(VIDEO_TIMEUPDATE, this.isReadyToAction);
	}

	stopListeningToRadio() {
		this.stopListeningToChannel(VIDEO_TIMEUPDATE);
	}

	isReadyToAction(event) {
		if (!event.detail.time) {
			return;
		}

		const time = secondsToMilliseconds(event.detail.time);

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
