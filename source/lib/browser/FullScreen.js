export default FullScreen;

/**
 * Handles the fullscreen API for client devices
 */
class FullScreen {
	/**
	 * Returns currently known API methods for client devices
	 * @returns {object}
	 */
	static vendorAPI() {
		return {
			universal: {
				isAvailable: 'fullscreenEnabled',
				request: 'requestFullscreen',
				exit: 'exitFullscreen',
				event: 'fullscreenchange'
			},
			webkit: {
				isAvailable: 'webkitFullscreenEnabled',
				request: 'webkitRequestFullscreen',
				exit: 'webkitExitFullscreen',
				event: 'webkitfullscreenchange'
			},
			moz: {
				isAvailable: 'mozFullScreenEnabled',
				request: 'mozRequestFullScreen',
				exit: 'mozCancelFullScreen',
				event: 'mozfullscreenchange'
			},
			ms: {
				isAvailable: 'msFullscreenEnabled',
				request: 'msRequestFullscreen',
				exit: 'msExitFullscreen',
				event: 'MSFullscreenChange'
			}
		};
	}

	/**
	 * Returns the correct vendor API for client
	 * @returns {object | null}
	 */
	static returnVendorAPI() {
		let vendorAPI = this.vendorAPI(),
			vendors = Object.keys(vendorAPI);

		for (let i = 0; i < vendors.length; i += 1) {
			let vendor = vendors[i],
				api = vendorAPI[vendor],
				isFullscreenAvailable = api.isAvailable;

			if (document[isFullscreenAvailable]) {
				return api;
			}
		}

		return null;
	}

	/**
	 * @param {object} element
	 */
	constructor(element) {
		this.element = element;
		this.root = document;
		this.state = false;
		this.api = this.constructor.returnVendorAPI();
		this.isAvailable = Boolean(this.api);
	}

	/**
	 * Toggle fullscreen mode
	 */
	toggle() {
		if (!this.isAvailable) {
			throw new Error('Fullscreen not available on this device');
		}

		if (this.state) {
			this.exit();
			return;
		}

		this.request(this.element);
	}

	/**
	 * Sends a fullscreen request
	 * @param {object} element
	 */
	request(element) {
		element[this.api.request]();
		this.state = true;
	}

	/**
	 * Sends an exit fullscreen request
	 */
	exit() {
		this.root[this.api.exit]();
		this.state = false;
	}

	/**
	 * Returns the correct event for the client
	 * @returns {string | null}
	 */
	returnEvent() {
		return this.api.event || null;
	}
}
