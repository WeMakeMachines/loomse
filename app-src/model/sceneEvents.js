/**
 * Handles all the logic for the scene events
 *
 */

import config from '../configs/config';
import media from '../view/media';
import sceneEventsView from '../view/sceneEvents';
import userDefinedModules from '../user/extensions';

const MINIMUM_SEEK_RANGE = config.behaviour.media.minimum_seek_range;

let events = {
		queue : [],
		update: function(callback) {
			for (let i = 0; i < this.queue.length; i += 1) {
				callback(this.queue[i]);
			}
		},
		killAll: function() {
			this.update((event) => {
				event.kill();
			});
		},
		resetStates: function() {
			this.update((event) => {
				event.state = 'waiting';
			});
		},
		fixStates: function(time) {
			this.update((event) => {
				event.fixState(time);
			});
		}
	},
	previousMediaTimeIndex = 0;

/**
 * Event class
 */
class Event {

	/**
	 * Constructor event
	 * @param {String} id
	 * @param {String} call
	 * @param {Object} schedule
	 * @param {Object} parameters
	 */
	constructor(id, call, schedule, parameters, element) {
		this.id = id; // event id
		this.call = call;
		this.state = 'waiting'; // waiting, fired, expired
		this.in = schedule.in;
		this.out = schedule.out;
		this.parameters = parameters;
		this.class = parameters.class;
		this.element = element;
	}

	/**
	 * Checks if the event is ready to fire
	 * @param {Number} time
	 * @returns {boolean}
	 */
	checkShouldFire(time) {
		return time >= this.in && this.state === 'waiting';
	}

	/**
	 * Checks if the event should expire
	 * @param {Number} time
	 * @returns {boolean}
	 */
	checkShouldExpire(time) {
		return time >= this.out && this.state === 'fired';
	}

	/**
	 * Checks if the event should perform an action
	 * @param {Number} time
	 * @returns {Boolean}
	 */
	checkSchedule(time) {
		if (this.state === 'expired') {
			return false;
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
	 * @param {Number} time
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
		this.call.run(this.element);
	}

	/**
	 * Stops the event and removes any performed actions
	 */
	kill() {
		this.call.stop();
	}
}

/**
 * Checks for a valid API of the event  extension
 * @param {Function} ext
 * @param {Array} API - array of strings which map to API calls
 * @returns {*}
 */
function checkEventExtensionAPI(ext, API) {

	if (typeof ext !== 'function') { return false; }

	for (let i = 0; i < API.length; i += 1) {
		let apiCall = API[i];

		if (typeof ext()[apiCall] !== 'function') {
			return false;
		}
	}

	return true;
}

/**
 * Schedules timed events for each media element
 *
 * @param {Array} array
 */
function schedule(array) {

	for (let i = 0; i < array.length; i += 1) {

		let eventToSchedule = array[i],
			extensionCalls = userDefinedModules[eventToSchedule.call],
			checkExtensionAPI = checkEventExtensionAPI(extensionCalls, ['run', 'stop']);

		if (!checkExtensionAPI || eventToSchedule.disabled) { continue; }

		let id = eventToSchedule.call + '_' + i,
			event = new Event(
				id,
				extensionCalls(),
				eventToSchedule.schedule,
				eventToSchedule.parameters,
				sceneEventsView.createEventElement(id)
			);

		events.queue.push(event);
	}
}

/**
 * Sets listeners for the HTML5 media object
 */
function setListeners () {
	media.parentElement.addEventListener('media:state:change', (eventObject) => {
		let message = eventObject.detail,
			isSameTime = message.time - previousMediaTimeIndex === 0,
			isSeeking = message.time - previousMediaTimeIndex >= MINIMUM_SEEK_RANGE || message.state === 'seeking';

		if (isSameTime) { return false; }

		if (isSeeking) {
			events.fixStates(message.time);
			previousMediaTimeIndex = message.time;
			return false;
		}

		events.update((event) => {
			event.checkSchedule(message.time);
		});

		previousMediaTimeIndex = message.time;
	}, false);
}

const sceneEventsModel = {

	/**
	 * Initialises the module
	 * @param {Array} eventArray
	 */
	initialise: (eventArray) => {
		schedule(eventArray);
		setListeners();
	}
};

export { sceneEventsModel as default };