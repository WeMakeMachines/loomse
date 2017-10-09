/**
 * Handles the view component for the sceneEvents
 *
 */

import { element } from '../tools/common';

const SETUP = {
	id: 'events'
};

let parentElement = element.create({ id: SETUP.id });

/**
 * Creates an element for the event
 * @param {string} id
 * @returns {object}
 */
function createEventElement(id) {
	let eventElement = element.create({ id });

	// apply class hidden
	parentElement.appendChild(eventElement);

	return eventElement;
}

const sceneEventsView = {
	parentElement,
	createEventElement
};

export { sceneEventsView as default };