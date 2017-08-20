/**
 * Common tools
 *
 */

const element = {

	create: (options) => {
		let newElement;

		if (!options) { options = {}; }

		if (!options.type) { options.type = 'div'; }

		newElement = document.createElement(options.type);

		if (options.id) {
			newElement.setAttribute('id', options.id);
		}

		if (options.class) {
			newElement.setAttribute('class', options.class);
		}

		return newElement;
	},

	attributes: (element, attributes) => {
		if (attributes && Array.isArray(attributes)) {
			for (let i = 0; i < attributes.length; i += 1) {
				let property = attributes[i][0],
					value = attributes[i][1];
				element.setAttribute(property, value);
			}
		}
	},

	style: (element, cssProperties) => {
		for (let attribute in cssProperties) {
			if (cssProperties.hasOwnProperty(attribute)) {
				let value = cssProperties[attribute];

				switch (attribute) {
					case 'width':
					case 'height':
					case 'top':
					case 'left':
					case 'right':
					case 'bottom':
						value += 'px';
						break;
					default:
						break;
				}

				element.style[attribute] = value;
			}
		}
	}
};

/**
 * Simplified AJAX call
 * @param {String} url
 * @param {String} type
 *
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
	 * @param {Number} number
	 *
	 * @returns {String}
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
 * @param {Function} callback
 * @param {Number} delay
 * @returns {Function}
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

export { ajaxRequest, cleanString, clock, debounce, element, random, report };