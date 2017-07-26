/**
 * Handles all the logic for the scene events
 *
 */

import media from '../view/media';
import { report } from '../tools/common';

let eventQueue = [],
	previousMediaTimeIndex;

const MINIMUM_SEEK_RANGE = 1000;

const events = (function () {

	/**
	 * Initialise our events
	 * @param {Array} eventArray
	 */
	function initialise (eventArray) {
		schedule(eventArray);
		setListeners();
	}

	/**
	 *
	 */
	function setListeners () {
		media.container.addEventListener('media:state:change', (eventObject) => {
			let message = eventObject.detail;

			if (message.state === 'seeking') {
				fixEventStates(message.time);
			}
		}, false);
	}

	/**
	 * Event class
	 */
	class Event {

		/**
		 * Constructor event
		 * @param {String} id
		 * @param {String} call
		 * @param {Boolean} ignored
		 * @param {Object} schedule
		 * @param {Object} parameters
		 */
		constructor (id, call, ignored, schedule, parameters) {
			this.id = id; // event id
			this.call = call;
			this.state = 'waiting'; // waiting, fired, expired
			this.in = schedule.in;
			this.out = schedule.out;
			this.parameters = parameters;
			this.class = parameters.class;
		}

		/**
		 * Schedules the event to be fired
		 *
		 * Because of a discrepency between the way Firefox and Chromium fire media events,
		 * we can not rely on the browser (Chromium sends a 'timeupdate' event before the 'seeking' event,
		 * but Firefox handles this correctly, i.e, no 'timeupdate' event).
		 *
		 */
		schedule () {

			media.container.addEventListener('media:state:change', (eventObject) => {
				let message = eventObject.detail,
					isSameTime = previousMediaTimeIndex && message.time - previousMediaTimeIndex === 0,
					isSeeking = previousMediaTimeIndex && message.time - previousMediaTimeIndex >= MINIMUM_SEEK_RANGE;

				if (!isSeeking && !isSameTime && (message.state === 'playing' || message.state === 'timeupdate')) {

					switch (this.state) {
						case 'waiting':
							if (message.time >= this.in) {
								this.run();
								this.state = 'fired';
							}
							break;
						case 'fired':
							if (message.time >= this.out) {
								this.kill();
								this.state = 'expired';
							}
							break;
						default:
							previousMediaTimeIndex = message.time;
							break;
					}
				}

			}, false);
		}

		/**
		 * Runs the event
		 */
		run () {
			console.log('firing!', this.id);
		}

		/**
		 * Stops the event and removes any performed actions
		 */
		kill () {
			console.log('closing!', this.id);
		}
	}

	/**
	 * Schedules timed events for each media element
	 *
	 * @param {Array} array
	 * @param {Function} callback
	 */
	function schedule(array) {

		for (let i = 0; i < array.length; i += 1) {
			let eventToSchedule = array[i],
				id = eventToSchedule.call + '_' + i,
				event = new Event(
					id,
					eventToSchedule.call,
					eventToSchedule.ignored,
					eventToSchedule.schedule,
					eventToSchedule.parameters
				);

			eventQueue.push(event);
			event.schedule();
		}
	}

	/**
	 * Reset all events back to waiting
	 *
	 */
	function resetAll() {
		for (let i = 0; i < eventQueue.length; i += 1) {
			eventQueue[i].state = 'waiting';
		}
	}

	/**
	 * Report all events
	 *
	 */
	function show() {
		report(eventQueue);
	}

	/**
	 * Kill all scheduled events
	 *
	 * @param {Function} callback
	 */
	function killAll(callback) {
		for (let i = 0; i < eventQueue.length; i += 1) {
			eventQueue[i].kill(callback);
		}
	}

	/**
	 * Checks event states against current media time and fixes them
	 * @param {Number} time - media time index
	 */
	function fixEventStates (time) {

		for (let i = 0; i < eventQueue.length; i += 1) {
			let event = eventQueue[i];

			if (event.in <= time || event.out < time) {
				event.state = 'expired';
			}

			if (event.in >= time && event.out > time) {
				event.state = 'waiting';
			}
		}
	}

	return {
		initialise: initialise,
		resetAll  : resetAll,
		show      : show,
		killAll   : killAll
	};
}());

export default events;