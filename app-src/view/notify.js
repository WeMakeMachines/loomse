/**
 * Handles all user friendly notifications
 *
 */

import { element } from '../tools/common';

const SETUP = {
	id   : 'notify',
	class: 'scaleToParent'
};

let parentElement = element.create({ id: SETUP.id, class: SETUP.class }),
	content;

/**
 * Adds written content onto display
 *
 * @param {Object} data
 */
function splash(data) {
	if(!typeof data === 'object' && !data.html) { return; }

	content = element.create();
	content.appendChild(data.html);
	parentElement.appendChild(content);
}

/**
 * Removes written content
 *
 */
function wipe () {
	parentElement.removeChild(content);
	content = null;
}

const notify = {
	parentElement,
	splash,
	wipe
};

export { notify as default };