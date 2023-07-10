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
 */
function getDocumentDimensions(): { width: number; height: number } {
	return {
		width: Math.min(document.body.clientWidth, window.innerWidth),
		height: window.innerHeight
	};
}

/**
 * Gets the current element dimensions
 */
function getElementDimensions(element: HTMLElement): {
	width: number;
	height: number;
} {
	const elementDimensions = element.getBoundingClientRect();

	return {
		width: elementDimensions.width,
		height: elementDimensions.height
	};
}

function isCompatible(): boolean {
	return supportsVideo();
}

/**
 * Checks if current browser supports the VIDEO canPlayType method
 */
function supportsVideo(): boolean {
	let test = document.createElement('video').canPlayType;

	return Boolean(test);
}
