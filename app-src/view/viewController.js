import config from '../configs/config';
import media from './media';
import { newObject } from '../tools/common';
import { style } from '../tools/css';

let elements = {
		root   : null,
		stage  : newObject('div', { id: 'stage' }),
		overlay: newObject('div', { id: 'overlay' })
	},
	resolution = {
		width : null,
		height: null
	};

/**
 * Gets the current client dimensions
 *
 */
function getClientDimensions() {
	resolution.width = document.documentElement.clientWidth;
	resolution.height = document.documentElement.clientHeight;
}

/**
 * Resizes all parent elements to be of same resolution
 */
function resizeContainers(width, height) {
	for (let element in elements) {
		if (elements.hasOwnProperty(element)) {

			style(elements[element], {
				width : width,
				height: height
			});
		}
	}
}

const viewController = {

	/**
	 * Sets up the DOM in browser
	 * @returns {Boolean}
	 */
	initialise: function() {

		if (config.appRoot) {
			elements.root = document.getElementById(config.appRoot);
		} else {
			return false;
		}

		// if ID can't be found, create root
		if (elements.root !== null || elements.root !== undefined) {
			elements.root = newObject('div', { root: true });
			document.body.appendChild(elements.root);
		}

		elements.root
			.appendChild(elements.stage);

		elements.root
			.appendChild(elements.overlay);

		elements.stage
			.appendChild(media.element);

		//elements.events = newObject('div', { id: 'events', parent: elements.overlay });
		//elements.subtitles = newObject('div', { id: 'subtitles', parent: elements.overlay });

		return true;
	},

	elements  : elements,
	resolution: resolution
};

export { viewController as default };