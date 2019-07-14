import Component from '../Abstract';

import { Queue } from '../../Models';

import { VIDEO_TIMEUPDATE } from '../../../constants/applicationActions';
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
		this.radioCallback = event => {
			if (event.detail.time) {
				const time = secondsToMilliseconds(event.detail.time);

				this.isReadyToAction(time);
			}
		};

		this.listenToRadio();
	}

	listenToRadio() {
		radio.listen(VIDEO_TIMEUPDATE, this.radioCallback);
	}

	stopListeningToRadio() {
		radio.stopListening(VIDEO_TIMEUPDATE, this.radioCallback);
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
