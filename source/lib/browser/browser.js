import FullScreen from './FullScreen';
import LocalStorage from './LocalStorage';

export const browser = {
	fullscreen(element) {
		return new FullScreen(element);
	},

	/**
	 * Gets the current element dimensions
	 * @param {HTMLElement} element
	 * @returns {{width: number, height: number}}
	 */
	getElementDimensions(element) {
		const elementDimensions = element.getBoundingClientRect();

		return {
			width: elementDimensions.width,
			height: elementDimensions.height
		};
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
	 * Determines if the device has a small screen or not
	 * @param {number} minimumResolution
	 * @returns {boolean}
	 */
	hasSmallScreen(minimumResolution) {
		let dimensions = this.getWindowDimensions();

		return (
			dimensions.width < minimumResolution ||
			dimensions.height < minimumResolution
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

	getExternalModule(externalModuleReference, moduleName) {
		if (!externalModuleReference) {
			return;
		}

		const module = window[externalModuleReference][moduleName];

		if (!module) {
			throw new Error('No modules found');
		}

		return module;
	},

	localStorage: new LocalStorage()
};
