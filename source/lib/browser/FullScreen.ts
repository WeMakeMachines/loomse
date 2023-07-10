/**
 * Handles the fullscreen API for client devices
 */
export default class FullScreen {
	public root = document;
	public state = false;
	public api = FullScreen.returnVendorAPI();

	public element: HTMLElement;
	public isAvailable: boolean;

	/**
	 * Returns currently known API methods for client devices
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
	 */
	static returnVendorAPI() {
		const vendorAPI: {
			[key: string]: {
				isAvailable: string;
				request: string;
				exit: string;
				event: string;
			};
		} = FullScreen.vendorAPI();
		const vendors = Object.keys(vendorAPI);

		for (let i = 0; i < vendors.length; i += 1) {
			const vendor = vendors[i];
			const api = vendorAPI[vendor];
			const isFullscreenAvailable = api.isAvailable;

			// @ts-ignore
			if (document[isFullscreenAvailable]) {
				return api;
			}
		}

		return null;
	}

	constructor(element: HTMLElement) {
		this.element = element;
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
	 */
	request(element: HTMLElement) {
		// @ts-ignore
		element[this.api.request]();
		this.state = true;
	}

	/**
	 * Sends an exit fullscreen request
	 */
	exit() {
		// @ts-ignore
		this.root[this.api.exit]();
		this.state = false;
	}

	/**
	 * Returns the correct event for the client
	 */
	returnEvent() {
		if (!this.api) return;

		return this.api.event;
	}
}
