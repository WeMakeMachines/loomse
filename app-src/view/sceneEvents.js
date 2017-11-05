/**
 * Handles the view component for the sceneEvents
 */
import Element from '../tools/element';

const SETUP = {
	id: 'events'
};

let parentElement = new Element({ id: SETUP.id }).node;

/**
 * Creates an element for the event
 * @param {string} id
 * @returns {object}
 */
function createEventElement(id) {
	let eventElement = new Element({ id }).node;

	// TODO apply class hidden

	parentElement.appendChild(eventElement);

	return eventElement;
}

const sceneEventsView = {
	parentElement,
	createEventElement
};

export { sceneEventsView as default };