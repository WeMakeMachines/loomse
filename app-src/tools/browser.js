import { FullscreenAPI } from './fullscreen_api';
import config from '../configs/config';
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
 * @returns {boolean}
 */
function isMobile() {
	let dimensions = getClientDimensions();

	return dimensions.width < config.mobile.minimumResolution ||
		dimensions.height < config.mobile.minimumResolution;
}

const browser = {

	fullscreen(element) {
		this.fullscreen = new FullscreenAPI(element);
	},

	getClientDimensions,
	isMobile,
	storage
};

export { browser };