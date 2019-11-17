/**
 * Common tools
 */
export { ajaxRequest, cleanString, debounce, isEmptyObject, random };

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
			reject('File or network error');
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
 * Checks if an object is empty
 * @param {Object} object
 * @returns {boolean}
 */
function isEmptyObject(object) {
	const keys = Object.keys(object);

	return !Boolean(keys.length);
}

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
