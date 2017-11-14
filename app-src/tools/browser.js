import { FullscreenAPI } from './browser_api';
import config from '../configs/config';

/**
 * Gets the current client dimensions
 * @returns {object}
 */
function getClientDimensions() {

	return {
		width : document.documentElement.clientWidth,
		height: document.documentElement.clientHeight
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

	isMobile
};

export { browser };