/**
 * Provides an API for handling html based notifications
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
	if (typeof data !== 'object' || !data.html) { return; }

	if (content) {
		wipe();
	}

	content = element.create();
	content.innerHTML = data.html;
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