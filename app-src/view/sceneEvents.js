/**
 * Handles the view component for the sceneEvents
 */
import element from '../tools/element';

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
	let eventElement = element({ id });

	// TODO apply class hidden

	parentElement.attach(eventElement);

	return eventElement;
}

const sceneEventsView = {
	parentElement,
	createEventElement
};

export { sceneEventsView as default };