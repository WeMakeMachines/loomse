/**
 * Checks if an object is empty
 */
export function isEmptyObject(object: { [key: string]: any }) {
	const keys = Object.keys(object);

	return !Boolean(keys.length);
}

/**
 * Returns a random number between minRange and maxRange
 */
export function random(minRange: number, maxRange: number): number {
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
