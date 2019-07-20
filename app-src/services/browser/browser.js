import config from '../../config';
import FullScreen from './FullScreen';
import LocalStorage from './LocalStorage';

export const browser = {
	fullscreen(element) {
		return new FullScreen(element);
	},

	/**
	 * Gets the current window dimensions
	 * @returns {{width: number, height: number}}
	 */
	getWindowDimensions() {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		};
	},

	/**
	 * @returns {boolean}
	 */
	hasSmallScreen() {
		let dimensions = this.getWindowDimensions();

		return (
			dimensions.width < config.mobile.minimumResolution ||
			dimensions.height < config.mobile.minimumResolution
		);
	},

	isCompatible() {
		return this.supportsVideo();
	},

	/**
	 * Checks if current browser supports the VIDEO canPlayType method
	 * @returns {boolean}
	 */
	supportsVideo() {
		let test = document.createElement('video').canPlayType;

		return Boolean(test);
	},

	localStorage: new LocalStorage()
};
