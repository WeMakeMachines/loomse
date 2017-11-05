/**
 * Handles all the logic for the scene events
 */
import Event from '../view/components/event';
import media from '../view/media';
import sceneEventsView from '../view/sceneEvents';
import storyBehaviour from '../configs/storyBehaviour';
import userDefinedModules from '../user/extensions';

const MINIMUM_SEEK_RANGE = storyBehaviour.media.minimumSeekRange;

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
 * Checks for a valid API of the event  extension
 * @param {function} ext
 * @param {array} API - array of strings which map to API calls
 * @returns {boolean}
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
 * @param {array} array
 */
function schedule(array) {

	for (let i = 0; i < array.length; i += 1) {

		let eventToSchedule = array[i],
			extensionCalls = userDefinedModules[eventToSchedule.call],
			checkExtensionAPI = checkEventExtensionAPI(extensionCalls, ['run', 'stop']);

		if (!checkExtensionAPI || eventToSchedule.disabled) { continue; }

		let id = `${eventToSchedule.call}_${i}`,
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
function addMediaListener() {
	media.parentElement.node.addEventListener('media:state:change', mediaListener, false);
}

/**
 * Removes the media listener
 */
function removeMediaListener() {
	media.parentElement.node.removeEventListener('media:state:change', mediaListener, false);
}

/**
 * Function which is triggered by the listener
 * @param {object} eventObject
 */
function mediaListener(eventObject) {

	let message = eventObject.detail,
		isSameTime = message.time - previousMediaTimeIndex === 0,
		isSeeking = message.time - previousMediaTimeIndex >= MINIMUM_SEEK_RANGE || message.state === 'seeking';

	if (isSameTime) { return; }

	if (isSeeking) {
		events.fixStates(message.time);
		previousMediaTimeIndex = message.time;
		return;
	}

	events.update((event) => {
		event.checkSchedule(message.time);
	});

	previousMediaTimeIndex = message.time;
}

const sceneEventsModel = {

	/**
	 * Initialises the module
	 * @param {array} eventArray
	 * @returns {boolean}
	 */
	initialise(eventArray) {
		schedule(eventArray);
		addMediaListener();

		return true;
	}
};

export { sceneEventsModel as default };