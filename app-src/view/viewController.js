/**
 * Handles all the main view arrangements
 *
 */

import config from '../configs/config';
import { element } from '../tools/common';
import loading from './loading';
import media from './media';
import sceneEventsView from './sceneEvents';
import subtitlesView from './subtitles';

const SETUP = {
	stageID  : 'stage',
	overlayID: 'overlay'
};

let appNodes = {
		root   : null,
		stage  : element.create({ id: SETUP.stageID }),
		overlay: element.create({ id: SETUP.overlayID })
	},
	resolution = {
		width : null,
		height: null
	};

/**
 * Appends multiple elements to a single node
 * @param {Object} parent
 * @param {Array} children
 */
function appendToParent(parent, children) {
	let fragment = document.createDocumentFragment();

	for (let i = 0; i < children.length; i += 1) {
		let child = children[i];

		fragment.appendChild(child);
	}

	parent.appendChild(fragment);
}

/**
 * Creates all DOM elements needed for each view
 * @returns {Boolean}
 */
function prepareDOM() {

	appNodes.root = document.getElementById(config.appRoot);

	if (typeof appNodes.root !== 'object') { return false; }

	appendToParent(appNodes.root, [
		appNodes.stage,
		appNodes.overlay,
		loading.parentElement
	]);

	appendToParent(appNodes.overlay, [
		sceneEventsView.parentElement,
		subtitlesView.parentElement
	]);

	appendToParent(appNodes.stage, [
		media.parentElement
	]);

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
	for (let child in appNodes) {
		if (appNodes.hasOwnProperty(child)) {

			element.style(appNodes[child], {
				width,
				height
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

	appNodes,
	resolution
};

export { viewController as default };