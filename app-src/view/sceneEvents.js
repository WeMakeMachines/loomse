/**
 * Handles the view component for the sceneEvents
 *
 */

import { element } from '../tools/common';

let parentElement = element.create({ id: 'events' });

/**
 * Creates an element for the event
 * @param {String} id
 * @returns {Object}
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