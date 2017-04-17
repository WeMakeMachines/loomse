// A short library to help with CSS styling and animations
export default {
	style: function (DOMobject, cssProperties) {
		for (let attribute in cssProperties) {
			if (cssProperties.hasOwnProperty(attribute)) {
				let value = cssProperties[attribute];

				if (attribute === 'width' || attribute === 'height' || attribute === 'top' || attribute === 'left' || attribute === 'right' || attribute === 'bottom') {
					value = value + 'px';
				}

				DOMobject.style[attribute] = value;
			}
		}
	},

	animate: function (DOMobject, parameter, startValue, endValue, time, callback, steps) {
		let currentValue,
			numberOfSteps,
			currentStep,
			difference,
			timeStep,
			valueStep,
			styles = {},
			step;

		if (typeof steps !== 'number') {
			steps = 4; // the more steps the smoother the animation, default is 4
		}

		//numberOfSteps = steps;
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
	},

	interrupt: function (interval) {
		clearInterval(interval);
	}
};
