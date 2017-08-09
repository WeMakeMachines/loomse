import config from '../configs/config';
import { style } from './css';

/**
 * Simplified AJAX call
 * @param {String} url
 * @param {String} type
 *
 * @returns {Promise}
 */
function ajaxRequest(url, type) {

	return new Promise((resolve, reject) => {

		let xmlHTTP = new XMLHttpRequest();

		xmlHTTP.open('GET', url);
		xmlHTTP.send();

		xmlHTTP.onload = function () {

			if (xmlHTTP.status === 200) {
				switch (type) {
					case 'JSON':
						resolve(JSON.parse(xmlHTTP.responseText));
						break;
					default:
						resolve(xmlHTTP.status);
						break;
				}
			} else {
				reject(xmlHTTP.status);
			}

		};

		xmlHTTP.onerror = function () {
			reject(report('File or network error'));
		};

	});
}

/**
 * Removes whitespace from a string, and converts to lowercase
 * @param {String} string
 *
 * @returns {String}
 */
function cleanString(string) {

	return string.replace(/\s+/g, '').toLowerCase();

}

/**
 * Turns seconds into hours, minutes, seconds
 * @param {Number} timeInMilliseconds
 *
 * @returns {Object}
 */
function clock(timeInMilliseconds) {
	const SECONDS_IN_MINUTES = 60;
	const SECONDS_IN_HOURS = 60 * SECONDS_IN_MINUTES;
	const MILLISECONDS_IN_SECONDS = 1000;

	let remainder = timeInMilliseconds / MILLISECONDS_IN_SECONDS,
		hours,
		minutes,
		seconds,
		split;

	/**
	 * Normalises time display by adding a leading zero
	 * @param {Number} number
	 *
	 * @returns {String}
	 */
	function addLeadingZero(number) {
		let string = number.toString();

		if (number < 10) {
			string = '0' + string;
		}

		return string;
	}

	// find how many hours there are
	if (remainder >= SECONDS_IN_HOURS) {
		hours = Math.floor(remainder / SECONDS_IN_HOURS);
		remainder = remainder - hours * SECONDS_IN_HOURS;
	} else {
		hours = 0;
	}

	// find how many minutes there are
	if (remainder >= SECONDS_IN_MINUTES) {
		minutes = Math.floor(remainder / SECONDS_IN_MINUTES);
		remainder = remainder - minutes * SECONDS_IN_MINUTES;
	} else {
		minutes = 0;
	}

	// find how many seconds
	if (remainder >= 1) {
		seconds = Math.floor(remainder);
		remainder = remainder - seconds;
	} else {
		seconds = 0;
	}

	split = remainder.toString();

	if (split === '0') {
		split = '000';
	}
	else {
		split = split.substr(2, 3);
	}

	return {
		hours  : addLeadingZero(hours),
		minutes: addLeadingZero(minutes),
		seconds: addLeadingZero(seconds),
		split  : split
	};
}

/**
 * Creates a DOM object
 * @param {String} type
 * @param {Object} options
 * @param {Object} css
 *
 * @returns {Object}
 */
function newObject(type, options, css) {
	let newObject,
		id = config.elementRoot;

	if (!type) { type = 'div'; }

	newObject = document.createElement(type);

	if (options) {
		if (options.id) {
			id = id + '_' + options.id;
		}

		if (options.id || options.root) {
			newObject.setAttribute('id', id);
		}

		if (options.class) {
			newObject.setAttribute('class', options.class);
		}

		if (options.parent) {
			options.parent.appendChild(newObject);
		}

		if (options.attributes && Array.isArray(options.attributes)) {
			for (let i = 0; i < options.attributes.length; i += 1) {
				let property = options.attributes[i][0],
					value = options.attributes[i][1];
				newObject.setAttribute(property, value);
			}
		}
	}

	if (css) {
		style(newObject, css); // test for bug here with the reference
	}

	return newObject;
}

/**
 * Returns a random number between minRange and maxRange
 * @param {Number} minRange
 * @param {Number} maxRange
 *
 * @returns {Number}
 */
function random(minRange, maxRange) {
	let range = maxRange - minRange;

	if (typeof minRange === 'undefined') {
		minRange = 0;
	}
	if (range <= 0) {
		range = maxRange;
		minRange = 0;
	}

	return Math.floor(Math.random() * range) + minRange;
}

/**
 * Outputs debugging information
 * @param {String} message
 *
 */
function report(message) {
	if (ENV === 'development') {
		// eslint-disable-next-line
		console.log(message);
	}
}

export { ajaxRequest, cleanString, clock, newObject, random, report };