import { EXPIRED, FIRED, WAITING } from '../../../constants/eventStates';

export class Event {
	constructor(options) {
		this.id = options.id;
		this.state = WAITING;
		this.function = options.extension;
		this.disabled = options.disabled;
		this.in = options.in;
		this.out = options.out;
		this.x = options.x;
		this.y = options.y;
		this.class = options.class;
	}

	run() {
		this.state = FIRED;
	}

	stop() {}
}
