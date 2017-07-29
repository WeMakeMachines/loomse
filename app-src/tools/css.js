/**
 * A small library to help with CSS styling and animations
 */

/**
 * Shorthand for styling HTML elements
 * @param {Object} DOMobject
 * @param {Object} cssProperties
 */
function style(DOMobject, cssProperties) {
	for (let attribute in cssProperties) {
		if (cssProperties.hasOwnProperty(attribute)) {
			let value = cssProperties[attribute];

			if (attribute === 'width' || attribute === 'height' || attribute === 'top' || attribute === 'left' || attribute === 'right' || attribute === 'bottom') {
				value = value + 'px';
			}

			DOMobject.style[attribute] = value;
		}
	}
}

/**
 * Animates a property on an HTML element
 * @param {Object} DOMobject
 * @param {String} parameter
 * @param {Number} startValue
 * @param {Number} endValue
 * @param {Number} time
 * @param {Function} callback
 * @param {Number} steps
 * @returns {number|*}
 */
function animate(DOMobject, parameter, startValue, endValue, time, callback, steps) {
	let currentValue,
		currentStep,
		difference,
		timeStep,
		valueStep,
		styles = {},
		step;

	if (typeof steps !== 'number') {
		steps = 4; // the more steps the smoother the animation, default is 4
	}

	currentStep = 0;
	difference = endValue - startValue;
	timeStep = time / steps;
	valueStep = difference / steps;
	step = setInterval(function () {
		if (currentStep > steps) {
			clearInterval(step);
			if (callback) {
				callback();
			}
		} else {
			if (currentStep === steps) {
				currentValue = endValue;
			} else {
				currentValue = startValue + valueStep * currentStep;
			}
			styles[parameter] = currentValue;
			this.style(DOMobject, styles);
			currentStep = currentStep + 1;
		}
	}, timeStep);

	return step;
}

/**
 * Clears the animation
 * @param {Object} interval
 */
function interrupt(interval) {
	clearInterval(interval);
}

export { animate, style, interrupt };