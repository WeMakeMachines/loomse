import data from '../../../model/data';

/**
 * Event class
 */
class Event {

	/**
	 * @param {string} id
	 * @param {string} extension
	 * @param {object} schedule
	 * @param {object} parameters
	 * @param {object} element
	 */
	constructor(id, extension, schedule, parameters, element) {
		this.id = id; // event id
		this.extension = extension;
		this.state = 'waiting'; // waiting, fired, expired
		this.in = schedule.in;
		this.out = schedule.out;
		this.parameters = parameters;
		this.class = parameters.class;
		this.element = element;
	}

	/**
	 * Checks if the event is ready to fire
	 * @param {number} time
	 * @returns {boolean}
	 */
	checkShouldFire(time) {
		return time >= this.in && this.state === 'waiting';
	}

	/**
	 * Checks if the event should expire
	 * @param {number} time
	 * @returns {boolean}
	 */
	checkShouldExpire(time) {
		return time >= this.out && this.state === 'fired';
	}

	/**
	 * Checks if the event should perform an action
	 * @param {number} time
	 */
	checkSchedule(time) {
		if (this.state === 'expired') {
			return;
		}

		if (this.checkShouldFire(time)) {
			this.run();
			this.state = 'fired';
		}

		if (this.checkShouldExpire(time)) {
			this.kill();
			this.state = 'expired';
		}
	}

	/**
	 * Fixes the current state after time index has jumped, say after seeking
	 * @param {number} time
	 */
	fixState(time) {
		if (time >= this.out || this.state === 'fired') {
			this.state = 'expired';
		}

		if (time <= this.in) {
			this.state = 'waiting';
		}
	}

	/**
	 * Runs the event
	 */
	run() {
		this.extension.run.call(this, this.element.node, () => {
			this.render();
		});
	}

	/**
	 * Stops the event and removes any performed actions
	 */
	kill() {
		this.extension.stop();
		this.element.detachFromParent();
	}

	/**
	 * Renders the event into the DOM
	 */
	render() {
		this.element.setPosition(data.dimensions, this.parameters.x, this.parameters.y)
			.attachToParent();
	}
}

export { Event as default };
