import css from '../css';
import { newObject } from '../tools/common';
import notify from '../notify';

export default (function () {
	let containers = {},
		resolution = {
			width : null,
			height: null
		},
		scaleTo;

	/**
	 * Gets the current client dimensions
	 *
	 */
	function getClientDimensions() {
		resolution.width = document.documentElement.clientWidth;
		resolution.height = document.documentElement.clientHeight;
	}

	/**
	 * Initialises the environment
	 *
	 */
	function initialise(DOMroot, expectedResolution) {
		// sets up the DOM environment
		containers.root = document.getElementById(DOMroot);
		containers.stage = newObject('div', { id: 'stage', parent: containers.root });
		containers.overlay = newObject('div', { id: 'overlay', parent: containers.stage });
		containers.mediaGroup = newObject('div', { id: 'mediaGroup', parent: containers.stage });
		containers.events = newObject('div', { id: 'events', parent: containers.overlay });
		containers.subtitles = newObject('div', { id: 'subtitles', parent: containers.overlay });

		if (typeof expectedResolution === 'object' && typeof expectedResolution.width === 'number' && typeof expectedResolution.height === 'number') {
			// if the resolution has been defined, we use the numbers given
			scaleTo = 'fixed';
			resolution.width = expectedResolution.width;
			resolution.height = expectedResolution.height;
		} else {
			scaleTo = 'responsive';
			getClientDimensions();
			setResizeListener();
		}

		resizeContainers();
	}

	function resizeContainers() {
		for (let container in containers) {
			if (containers.hasOwnProperty(container)) {

				css.style(containers[container], {
					width : resolution.width,
					height: resolution.height
				});
			}
		}
	}

	function repositionEvents() {
		let activeEvents = containers.events.children;
		if (activeEvents.length > 0) {
			for (let i = 0; i < activeEvents.length; i += 1) {
				if (typeof activeEvents[i].loomSE.position === 'function') {
					activeEvents[i].loomSE.resolution.width = resolution.width;
					activeEvents[i].loomSE.resolution.height = resolution.height;
					activeEvents[i].loomSE.position();
				}
			}
		}
	}

	function setResizeListener() {
		window.addEventListener('resize', function () {
			getClientDimensions();
			resizeContainers();
			repositionEvents();
			notify.resize();
		});
	}

	return {
		initialise: initialise,
		containers: containers,
		resolution: resolution
	};
}());
