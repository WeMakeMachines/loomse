/**
 * Handles all the main view arrangements
 */
import element from './components/element';
import { browser } from '../tools/browser';
import { debounce } from '../tools/common';

import config from '../configs/config';
import data from '../model/data';
import media from './media';
import mediaGui from './components/media_gui';
import popup from './popup';
import sceneEventsView from './sceneEvents';
import subtitlesView from './subtitles';

let appNodes = {
	root: {
		element : null,
		children: [
			{
				id       : 'stage',
				classList: ['stack', 'scaleToParent'],
				children : [media.parentElement]
			},
			{
				id       : 'stageFront',
				classList: ['stack', 'scaleToParent'],
				children : [subtitlesView.parentElement, sceneEventsView.parentElement]
			},
			{
				id       : 'gui',
				classList: ['stack', 'scaleToParent'],
				children : [mediaGui.parentElement]
			},
			{
				id       : 'overlay',
				classList: ['stack', 'scaleToParent'],
				children : [popup.parentElement]
			}
		]
	}
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

		fragment.appendChild(child.node);
	}

	parent.attach(fragment);
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
			child.element = element({ id: child.id })
				.setClass(child.classList);
		}

		if (child.children && child.children.length) {
			appendToParent(child.element, child.children);
		}

		root.attach(child.element);
	}
}

/**
 * Creates all DOM elements needed for each view
 * @param {string} html
 */
function prepareDOM(html) {

	let appRoot = element({ id: config.appRoot, parent: document.body });

	appRoot.innerHTML = html;

	appRoot.attachToParent();

	appNodes.root.element = appRoot;

	setupAppNodes(appNodes.root.element, appNodes.root.children);

}

/**
 * Resizes an element
 * @param {object} node
 * @param {number} width
 * @param {number} height
 */
function resize(node, width, height) {
	node.setStyle({
		width,
		height
	});
}

/**
 * Resize handler
 */
function handleViewportResizing() {
	data.dimensions = browser.getClientDimensions();
	resize(appNodes.root.element, data.dimensions.width, data.dimensions.height);
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
	initialise(html) {
		prepareDOM(html);
		browser.fullscreen(appNodes.root.element.node);
		setListeners();
		handleViewportResizing();
	}
};

export { viewController as default };