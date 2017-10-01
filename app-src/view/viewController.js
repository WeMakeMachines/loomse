/**
 * Handles all the main view arrangements
 *
 */

import { debounce, element } from '../tools/common';
import config from '../configs/config';
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
					class   : ['stack', 'scaleToParent'],
					children: [media.parentElement]
				},
				{
					id      : 'overlay',
					class   : ['stack', 'scaleToParent'],
					children: [notify.parentElement, subtitlesView.parentElement, sceneEventsView.parentElement]
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
		let child = children[i];

		if (!child.element) {
			child.element = element.create({
				id   : child.id,
				class: child.class
			});
		}

		if (child.children && child.children.length) {
			appendToParent(child.element, child.children);
		}

		root.appendChild(child.element);
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
 * Resizes an element
 * @param {Object} node
 * @param {Number} width
 * @param {Number} height
 */
function resize(node, width, height) {
	element.style(node, {
		width,
		height
	});
}

/**
 *
 */
function handleViewportResizing() {
	getClientDimensions();
	resize(appNodes.root.element, dimensions.width, dimensions.height);
}

/**
 *
 */
function setListeners() {

	const DEBOUNCE_DELAY = 200;

	window.addEventListener('resize', () => {
		debounce(handleViewportResizing, DEBOUNCE_DELAY);
	});
}

const viewController = {

	/**
	 * Sets up the DOM in browser
	 *
	 */
	initialise: () => {
		if (prepareDOM()) {
			setListeners();
			handleViewportResizing();
		}
	},

	appNodes
};

export { viewController as default };