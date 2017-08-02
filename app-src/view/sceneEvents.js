/**
 * Handles the view component for the sceneEvents
 *
 */
import { newObject } from '../tools/common';

let parentElement = newObject('div', { id: 'events' });

/**
 * Creates an element for the event
 * @param {String} id
 * @returns {Object}
 */
function createEventElement(id) {
	let eventElement = newObject('div', { id: id});

	// apply class hidden
	parentElement.appendChild(eventElement);

	return eventElement;
}

const sceneEventsView = {
	parentElement     : parentElement,
	createEventElement: createEventElement
};

export { sceneEventsView as default };