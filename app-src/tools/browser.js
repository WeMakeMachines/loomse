import FullscreenAPI from './fullscreen_api';
import config from '../configs/config.json';
import storage from './localstorage';

/**
 * Gets the current client dimensions
 * @returns {object}
 */
function getClientDimensions() {

	return {
		width : window.innerWidth,
		height: window.innerHeight
	};
}

/**
 * Checks if current browser supports the VIDEO canPlayType method
 * @returns {boolean}
 */
function supportsVideo() {
	let test = document.createElement('video').canPlayType;

	return Boolean(test);
}

/**
 * @returns {boolean}
 */
function isSmallScreen() {
	let dimensions = getClientDimensions();

	return dimensions.width < config.mobile.minimumResolution ||
		dimensions.height < config.mobile.minimumResolution;
}

const browser = {

	fullscreen(element) {
		this.fullscreen = new FullscreenAPI(element);
	},

	isCompatible() {
		return supportsVideo();
	},

	getClientDimensions,
	isSmallScreen,
	storage
};

export { browser };
