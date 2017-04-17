// Handles all user friendly notifications

import { default as css } from './css';
import { default as environment } from './environment';
import { default as helper } from './helpers';

export default (function () {
	// lowers 'curtain' on screen and pushes notification
	let id = 'notify',
		container = helper.newElement('div', id),
		child = document.createElement('div'),
		child2 = document.createElement('p'),
		isActive = false;

	function position(object) {
		let availableWidth = environment.resolution.width,
			availableHeight = environment.resolution.height;

		css.style(object, {
			opacity: 0
		});

		let objWidth = object.offsetWidth,
			objHeight = object.offsetHeight,
			x = availableWidth / 2,
			y = (availableHeight - objHeight) / 2;

		css.style(object, {
			position: 'absolute',
			display: 'block',
			left: x,
			top: y,
			opacity: 1
		});
	}

	return {
		resize: function () {
			position(child);
		},

		push: function (message, cssClass) {
			if (isActive === false) {
				isActive = true;
				// animate the 'curtain falling' on theatre

				css.animate(environment.containers.stage, 'opacity', 1, 0.2, 200);
				environment.containers.root.appendChild(container);
				if (cssClass) {
					child2.setAttribute('class', cssClass);
				}
				container.appendChild(child);
				child.appendChild(child2);
			}

			// push notification to screen

			child2.innerHTML = message;
			position(child);
		},

		dismiss: function () {
			if (isActive !== false) {
				isActive = false; // reset activity flag
				environment.containers.root.removeChild(container);
				css.animate(environment.containers.stage, 'opacity', 0.2, 1, 200);
			}
		}
	};
}());