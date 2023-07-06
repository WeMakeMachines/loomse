/**
 * Common tools
 */
export { cleanString, debounce, isEmptyObject, random };

/**
 * Removes whitespace from a string, and converts to lowercase
 * @param {string} string
 * @returns {string}
 */
function cleanString(string: string) {
	return string.replace(/\s+/g, '').toLowerCase();
}

/**
 * Prevents a function from being called repeatedly
 * @param {function} callback
 * @param {number} delay
 * @returns {function}
 */
const debounce = (() => {
	let delayedFunction: ReturnType<typeof setTimeout>;

	return (callback: () => void, delay: number) => {
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
function isEmptyObject(object: { [key: string]: any }) {
	const keys = Object.keys(object);

	return !Boolean(keys.length);
}

/**
 * Returns a random number between minRange and maxRange
 * @param {number} minRange
 * @param {number} maxRange
 * @returns {number}
 */
function random(minRange: number, maxRange: number) {
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
