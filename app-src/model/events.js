/**
 * Handles all the logic for the scene events,
 * for example we handle the schedule for each event here
 *
 */

import { newObject, report } from '../tools/common';
import config from '../config';
import data from './data';
import media from '../view/media';
import view from '../view/controller';

const events = (function () {
	let eventQueue = [];

	// Constructor function that creates instances of each event
	let Event = function (id, call, ignored, schedule, parameters) {

		//check if the module reference exists as a function
		if (typeof data.modules[call] === 'function') {
			let callModule = data.modules[call]();
		}

		if (ignored === true) {
			this.state = 'ignored';
		} else {
			this.state = 'waiting';
		}

		this.id = id; // event id
		this.call = call;
		this.state = 'waiting'; // waiting, fired, expired
		this.in = schedule.in / 1000;
		this.out = schedule.out / 1000;
		this.parameters = parameters;
		this.class = parameters.class;
		this.container = newObject('div', { id: id, class: this.class });
		this.container.loomSE = {
			resolution: {
				width : view.resolution.width,
				height: view.resolution.height
			},
			parameters: this.parameters,
			schedule  : {
				in : this.in,
				out: this.out
			}
		};
		this.container.loomSE.parameters.id = this.id;
		if (typeof this.parameters.x === 'number' && typeof this.parameters.y === 'number') {
			this.container.loomSE.position = function () {

				// using a co-ordinate system of %, place objects on screen
				let translatedCoords = {
						x: this.resolution.width / 100 * this.parameters.x,
						y: this.resolution.height / 100 * this.parameters.y
					},
					thisObject = document.getElementById('loomSE_' + this.parameters.id);
				thisObject.setAttribute('style', 'position: absolute; left: ' + translatedCoords.x + 'px; ' + 'top: ' + translatedCoords.y + 'px');
			};
		}
		// runs at beginning of event (in time)
		this.run = function () {
			if (this.state === 'waiting') {
				this.state = 'fired';
				view.containers.events.appendChild(this.container);
				callModule.run(this.container, {in: this.in, out: this.out}, this.parameters);
			}
		};
		// runs when the event has expired (out time)
		this.stop = function () {
			if (this.state === 'fired') {
				this.state = 'expired';
				view.containers.events.removeChild(this.container);
			}
		};
		this.kill = function (callback) {
			if (this.container.firstChild) {
				this.container.removeChild(this.container.firstChild);
			} else {
				callback();
			}
		};
	};

	/**
	 * Schedules timed events for each media element
	 *
	 * @param {Object} target ?
	 * @param {Array} array
	 * @param {Function} callback
	 */
	function schedule(target, array, callback) {

		for (let i = 0; i < array.length; i += 1) {
			let event = array[i],
				id = event.call + '_' + i;

			eventQueue[i] = new Event(id, event.call, event.ignored, event.schedule, event.parameters);

			Event.prototype.schedule = function () {

				// We calculate the ins and outs here
				let that = this,
					timeIn = that.in,
					timeOut = that.out,
					timeInLow = timeIn - config.behaviour.media.timeEventResolution / 2,
					timeInHigh = timeIn + config.behaviour.media.timeEventResolution / 2,
					timeOutLow = timeOut - config.behaviour.media.timeEventResolution / 2,
					timeOutHigh = timeOut + config.behaviour.media.timeEventResolution / 2;

				media.listen(function (time) {
					if (time >= timeInLow && time <= timeInHigh) {
						if (config.behaviour.developer.verbose === 'full') {
							report('[Event] Run: ' + id);
							report('[Event] ' + 'T:' + time + ', L:' + timeInLow + ', H:' + timeInHigh);
						}

						that.run();
					}
					// 'Out'
					if (time >= timeOutLow && time <= timeOutHigh) {
						if (config.behaviour.developer.verbose === 'full') {
							report('[Event] Stop: ' + id);
							report('[Event] ' + 'T:' + time + ', L:' + timeOutLow + ', H:' + timeOutHigh);
						}

						that.stop();
					}
				});
			};


			eventQueue[i].schedule();
		}

		callback();
	}

	/**
	 * Reset all events back to waiting
	 *
	 */
	function reset() {
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

	return {
		schedule: schedule,
		reset   : reset,
		show    : show,
		killAll : killAll
	};
}());

export default events;
