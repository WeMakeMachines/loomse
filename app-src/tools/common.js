/**
 * Common tools
 */

/**
 * Simplified AJAX call
 * @param {string} url
 * @param {string} type
 * @returns {Promise}
 */
function ajaxRequest(url, type) {
	const SUCCESS = 200;

	return new Promise((resolve, reject) => {
		let xmlHTTP = new XMLHttpRequest();

		xmlHTTP.open('GET', url);
		xmlHTTP.send();

		xmlHTTP.onload = () => {

			if (xmlHTTP.status === SUCCESS) {
				switch (type) {
					case 'JSON':
						resolve(JSON.parse(xmlHTTP.responseText));
						break;
					default:
						resolve(xmlHTTP.responseText);
						break;
				}
			} else {
				reject(xmlHTTP.status);
			}

		};

		xmlHTTP.onerror = () => {
			reject(report('File or network error'));
		};

	});
}

/**
 * Removes whitespace from a string, and converts to lowercase
 * @param {string} string
 * @returns {string}
 */
function cleanString(string) {

	return string.replace(/\s+/g, '').toLowerCase();

}

/**
 * Turns seconds into hours, minutes, seconds
 * @param {number} timeInMilliseconds
 * @returns {object}
 */
function clock(timeInMilliseconds) {
	const SECONDS_IN_MINUTES = 60;
	const MINUTES_IN_HOURS = 60;
	const SECONDS_IN_HOURS = MINUTES_IN_HOURS * SECONDS_IN_MINUTES;
	const MILLISECONDS_IN_SECONDS = 1000;

	let remainder = timeInMilliseconds / MILLISECONDS_IN_SECONDS,
		hours,
		minutes,
		seconds,
		split;

	/**
	 * Normalises time display by adding a leading zero
	 * @param {number} number
	 * @returns {string}
	 */
	function addLeadingZero(number) {
		let string = number.toString();

		if (number < 10) {
			string = `0${string}`;
		}

		return string;
	}

	// find how many hours there are
	if (remainder >= SECONDS_IN_HOURS) {
		hours = Math.floor(remainder / SECONDS_IN_HOURS);
		remainder -= hours * SECONDS_IN_HOURS;
	} else {
		hours = 0;
	}

	// find how many minutes there are
	if (remainder >= SECONDS_IN_MINUTES) {
		minutes = Math.floor(remainder / SECONDS_IN_MINUTES);
		remainder -= minutes * SECONDS_IN_MINUTES;
	} else {
		minutes = 0;
	}

	// find how many seconds
	if (remainder >= 1) {
		seconds = Math.floor(remainder);
		remainder -= seconds;
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
		split
	};
}

/**
 * Prevents a function from being called repeatedly
 * @param {function} callback
 * @param {number} delay
 * @returns {function}
 */
const debounce = (() => {
	let delayedFunction;

	return (callback, delay) => {

		if (delayedFunction) {
			clearTimeout(delayedFunction);
		}

		delayedFunction = setTimeout(() => {
			callback();
		}, delay);
	};
})();

/**
 * Returns a random number between minRange and maxRange
 * @param {number} minRange
 * @param {number} maxRange
 * @returns {number}
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
 * @param {string} message
 */
function report(message) {
	if (ENV === 'development') {
		// eslint-disable-next-line
		console.log(message);
	}
}

export { ajaxRequest, cleanString, clock, debounce, random, report };