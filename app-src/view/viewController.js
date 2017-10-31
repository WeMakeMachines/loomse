/**
 * Handles all the main view arrangements
 */
import { debounce, element } from '../tools/common';
import { browser } from '../tools/browser';

import config from '../configs/config';
import media from './media';
import mediaGui from './components/media_gui';
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
				},
				{
					id      : 'gui',
					class   : ['stack', 'scaleToParent'],
					children: [mediaGui.parentElement]
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
 * @param {object} parent
 * @param {array} children
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
 * @param {object} root
 * @param {array} children
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
 * @param {string} html
 */
function prepareDOM(html) {

	let body = document.getElementsByTagName('body')[0];

	body.innerHTML = html;

	appNodes.root.element = document.getElementById(config.appRoot);

	setupAppNodes(appNodes.root.element, appNodes.root.children);

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
 * @param {object} node
 * @param {number} width
 * @param {number} height
 */
function resize(node, width, height) {
	element.style(node, {
		width,
		height
	});
}

/**
 * Resize handler
 */
function handleViewportResizing() {
	getClientDimensions();
	resize(appNodes.root.element, dimensions.width, dimensions.height);
}

/**
 * Sets the application listeners
 */
function setListeners() {

	const DEBOUNCE_DELAY = 200;

	let fullscreenListener = browser.fullscreen.returnListener();

	window.addEventListener('resize', () => {
		debounce(handleViewportResizing, DEBOUNCE_DELAY);
	});

	if (fullscreenListener) {

		document.addEventListener(fullscreenListener, () => {
			handleViewportResizing();
		});
	}
}

const viewController = {

	appNodes,

	/**
	 * Sets up the DOM in the browser
	 * @param {string} html
	 */
	initialise: (html) => {
		prepareDOM(html);
		browser.fullscreen(appNodes.root.element);
		setListeners();
		handleViewportResizing();
	}
};

export { viewController as default };