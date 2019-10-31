import Block from '../Block';

import { EXPIRED, FIRED, WAITING } from '../../constants/eventStates';

export class Event {
	constructor(options) {
		this.id = options.id;
		this.state = WAITING;
		this.module = typeof options.module === 'function' ? options.module : null;
		this.disabled = options.disabled;
		this.in = options.in;
		this.out = options.out;
		this.x = options.x;
		this.y = options.y;
		this.payload = options.payload;
		this.parent = options.parent;
		this.element = new Block({
			type: 'div',
			id: `module-${options.id}`,
			x: options.x,
			y: options.y,
			parent: options.parent
		});
	}

	run() {
		if (!this.module) {
			return;
		}

		this.module().run(this.payload, this.element.node, () =>
			this.element.render()
		);

		this.state = FIRED;
	}

	stop() {
		if (!this.module) {
			return;
		}

		this.module().stop();
		this.element.unmount();

		this.state = EXPIRED;
	}
}
