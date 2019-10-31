import Event from '../Event';
import TimedComponent from '../TimedComponent';

import { STAGE_RESIZE } from '../../constants/applicationActions';

import styles from './styles';

export class Events extends TimedComponent {
	constructor(events) {
		super('events', styles.events, events);

		this.listenToChannel(STAGE_RESIZE, this.resizeEvents);
	}

	resizeEvents() {
		for (const key in this.activeEvents) {
			if (!this.activeEvents.hasOwnProperty(key)) {
				continue;
			}

			this.activeEvents[key].element.setPositionFromPercentage(
				this.activeEvents[key].x,
				this.activeEvents[key].y
			);
		}
	}

	run(event) {
		this.activeEvents[event.id] = new Event({
			id: event.id,
			parent: this.node,
			...this.queue.getTimedObject(event.id)
		});
		this.activeEvents[event.id].run();
	}

	stop(event) {
		this.activeEvents[event.id].stop();

		delete this.activeEvents[event.id];
	}
}
