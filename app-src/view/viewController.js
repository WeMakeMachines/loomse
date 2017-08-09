import config from '../configs/config';
import loading from './loading';
import media from './media';
import { newObject } from '../tools/common';
import sceneEventsView from './sceneEvents';
import { style } from '../tools/css';
import subtitles from './subtitles';

let elements = {
		parent : null,
		stage  : newObject('div', { id: 'stage' }),
		overlay: newObject('div', { id: 'overlay' })
	},
	resolution = {
		width : null,
		height: null
	};

/**
 * Creates all DOM elements needed for each view
 * @returns {Boolean}
 */
function prepareDOM() {

	elements.parent = document.getElementById(config.elementRoot);

	if (typeof elements.parent !== 'object') { return false; }

	elements.rootElement
		.appendChild(elements.stage);

	elements.rootElement
		.appendChild(elements.overlay);

	elements.rootElement
		.appendChild(loading.parentElement);

	elements.overlay
		.appendChild(sceneEventsView.parentElement);

	elements.overlay
		.appendChild(subtitles.parentElement);

	elements.stage
		.appendChild(media.parentElement);

	return true;
}

/**
 * Gets the current client dimensions
 */
function getClientDimensions() {
	resolution.width = document.documentElement.clientWidth;
	resolution.height = document.documentElement.clientHeight;
}

/**
 * Resizes all rootElement elements to be of same resolution
 * @param {Number} width
 * @param {Number} height
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

		return prepareDOM();
	},

	elements  : elements,
	resolution: resolution
};

export { viewController as default };