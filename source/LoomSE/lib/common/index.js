/**
 * Common tools
 */
export { cleanString, debounce, isEmptyObject, random };

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
