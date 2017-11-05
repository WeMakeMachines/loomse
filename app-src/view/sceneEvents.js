/**
 * Handles the view component for the sceneEvents
 */
import element from './components/element';

const SETUP = {
	id: 'events'
};

let parentElement = element({ id: SETUP.id });

/**
 * Creates an element for the event
 * @param {string} id
 * @returns {object}
 */
function createEventElement(id) {
	let eventElement = element({ id, parent: parentElement })
		.setClass('extension');

	return eventElement;
}

const sceneEventsView = {
	parentElement,
	createEventElement
};

export { sceneEventsView as default };