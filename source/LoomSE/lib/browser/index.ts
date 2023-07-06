import FullScreen from './FullScreen';
import LocalStorage from './LocalStorage';

export {
	fullscreen,
	getDocumentDimensions,
	getElementDimensions,
	isCompatible,
	supportsVideo,
	localStorage
};

const localStorage = new LocalStorage();

function fullscreen(element: HTMLElement) {
	return new FullScreen(element);
}

/**
 * Gets the current document dimensions
 * @returns {{width: number, height: number}}
 */
function getDocumentDimensions() {
	return {
		width: Math.min(document.body.clientWidth, window.innerWidth),
		height: window.innerHeight
	};
}

/**
 * Gets the current element dimensions
 * @param {HTMLElement} element
 * @returns {{width: number, height: number}}
 */
function getElementDimensions(element: HTMLElement) {
	const elementDimensions = element.getBoundingClientRect();

	return {
		width: elementDimensions.width,
		height: elementDimensions.height
	};
}

function isCompatible() {
	return supportsVideo();
}

/**
 * Checks if current browser supports the VIDEO canPlayType method
 * @returns {boolean}
 */
function supportsVideo() {
	let test = document.createElement('video').canPlayType;

	return Boolean(test);
}
