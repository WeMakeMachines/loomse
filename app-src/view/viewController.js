/**
 * Handles all the main view arrangements
 *
 */

import { debounce, element } from '../tools/common';
import config from '../configs/config';
import loading from './loading';
import media from './media';
import notify from './notify';
import sceneEventsView from './sceneEvents';
import subtitlesView from './subtitles';


let appNodes = {
		root: {
			element : null,
			children: [
				{
					id      : 'stage',
					children: [media.parentElement]
				},
				{
					id      : 'overlay',
					children: [notify.parentElement, sceneEventsView.parentElement, subtitlesView.parentElement]
				}
			]
		}
	},
	dimensions = {
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
 * Setup the application nodes
 * @param {Object} root
 * @param {Array} children
 */
function setupAppNodes(root, children) {
	for (let i = 0; i < children.length; i += 1) {
		let currentChild = children[i];

		if (!currentChild.element) {
			currentChild.element = element.create({ id: currentChild.id });
		}

		if (currentChild.children && currentChild.children.length) {
			appendToParent(currentChild.element, currentChild.children);
		}

		root.appendChild(currentChild.element);
	}
}

/**
 * Creates all DOM elements needed for each view
 * @returns {Boolean}
 */
function prepareDOM() {

	appNodes.root.element = document.getElementById(config.appRoot);

	if (typeof appNodes.root.element !== 'object') { return false; }

	setupAppNodes(appNodes.root.element, appNodes.root.children);

	setListeners();

	return true;
}

/**
 * Gets the current client dimensions
 */
function getClientDimensions() {
	dimensions.width = document.documentElement.clientWidth;
	dimensions.height = document.documentElement.clientHeight;
}

/**
 * Resizes all rootElement elements to be of same resolution
 * @param {Object} node
 * @param {Number} width
 * @param {Number} height
 */
function resizeContainers(node, width, height) {
	for (let child in node) {
		if (node.hasOwnProperty(child)) {

			element.style(node[child], {
				width,
				height
			});
		}
	}
}

/**
 *
 */
function handleViewportResizing() {
	getClientDimensions();
	//resizeContainers(appNodes.root.element, dimensions.width, dimensions.height);
}

/**
 *
 */
function setListeners() {

	const DEBOUNCE_DELAY = 300;

	window.addEventListener('resize', () => {
		debounce(handleViewportResizing, DEBOUNCE_DELAY);
	});
}

const viewController = {

	/**
	 * Sets up the DOM in browser
	 * @returns {Boolean}
	 */
	initialise: () => prepareDOM(),

	appNodes
};

export { viewController as default };