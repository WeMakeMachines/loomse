import Event from '../Event';
import TimedComponent from '../TimedComponent';

import styles from './styles';

export class Events extends TimedComponent {
	constructor(events) {
		super('events', styles.events, events);
	}

	run(event) {
		this.activeEvents[event.id] = new Event(
			this.queue.getTimedObject(event.id),
			this.node
		);
		this.activeEvents[event.id].run();
	}

	stop(event) {
		this.activeEvents[event.id].stop();

		delete this.activeEvents[event.id];
	}
}
