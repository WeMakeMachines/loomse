import { eventStates } from '../../constants';

export class Event {

	constructor(options) {
		this.id = options.id;
		this.state = eventStates.WAITING;
		this.function = options.extension;
		this.disabled = options.disabled;
		this.in = options.in;
		this.out = options.out;
		this.x = options.x;
		this.y = options.y;
		this.class = options.class;
	}

	run() {
		this.state = eventStates.FIRED;
	}

	stop() {
	}
}
