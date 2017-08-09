import config from '../configs/config';
import loading from './loading';
import media from './media';
import { newObject } from '../tools/common';
import sceneEventsView from './sceneEvents';
import { style } from '../tools/css';
import subtitles from './subtitles';

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
 * Creates all DOM elements needed for each view
 * @returns {Boolean}
 */
function prepareDOM() {

	elements.root = document.getElementById(config.elementRoot);

	if (typeof elements.root !== 'object') { return false; }

	elements.root
		.appendChild(elements.stage);

	elements.root
		.appendChild(elements.overlay);

	elements.root
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
	initialise: () => prepareDOM(),

	elements  : elements,
	resolution: resolution
};

export { viewController as default };