import { config } from './config';
import { default as css } from './css';

/**
 * Simplified AJAX call
 * @param {String} file
 * @param {String} fileType
 * @param {Boolean} async
 * @param {Function} callback
 *
 */
export function ajaxRequest (file, fileType, async, callback) {
	let data,
		xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status === 200) {
				if (fileType === 'JSON') {
					data = JSON.parse(xmlhttp.responseText);
				} else {
					data = xmlhttp.responseText;
				}
				callback(data);
			} else {
				callback(false);
			}
		}
	};

	xmlhttp.open('GET', file, async);
	xmlhttp.send();
}

/**
 * Outputs debugging information
 * @param {String} message
 *
 */
export function report (message) {
	if (ENV === 'development') {
		// eslint-disable-next-line
		console.log(message);
	}
}

/**
 * Returns a random number between minRange and maxRange
 * @param {Number} minRange
 * @param {Number} maxRange
 *
 * @return {Number}
 */
export function random (minRange, maxRange) {
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
 * Removes whitespace from a string, and converts to lowercase
 * @param {String} string
 *
 * @return {String}
 */
export function cleanString (string) {

	return string.replace(/\s+/g, '').toLowerCase();
}

/**
 * Creates a DOM object
 * @param {String} type
 * @param {Object} options
 * @param {Object} css
 *
 * @return {Object}
 */
export function newObject (type, options, css) {

	//parent, type, id, cssClass, cssProperties

	let newObject = document.createElement(type),
		newObjectId = config.applicationID + '_' + options.id;

	if (options.parent) {
		options.parent.appendChild(newObject);
	}

	if (options.id) {
		newObject.setAttribute('id', newObjectId);
	}

	if (options.class) {
		newObject.setAttribute('class', options.class);
	}

	if (css) {
		css.style(newObject, css); // test for bug here with the reference
	}

	return newObject;
}

/**
 * Turns seconds into hours, minutes, seconds
 * @param {Number} timeInSeconds
 *
 * @return {Object}
 */
export function clock (timeInSeconds) {
	let remainder = timeInSeconds,
		hours,
		minutes,
		seconds,
		split;

	/**
	 * Normalises time display by adding a leading zero
	 * @param {Number} number
	 *
	 * @return {String}
	 */
	function addLeadingZero(number) {
		let string = number.toString();

		if (number < 10) {
			string = '0' + string;
		}

		return string;
	}

	// find how many hours there are
	if (remainder >= 3600) {
		hours = Math.floor(remainder / 3600);
		remainder = remainder - hours * 3600;
	} else {
		hours = 0;
	}

	// find how many minutes there are
	if (remainder >= 60) {
		minutes = Math.floor(remainder / 60);
		remainder = remainder - minutes * 60;
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