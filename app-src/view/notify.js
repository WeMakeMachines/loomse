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
	content = element.create();

/**
 * Adds written content onto display
 *
 * @param {Object} content
 */
function splash(content) {

}

/**
 * Removes written content
 *
 */
function wipe () {

}

const notify = {
	parentElement,
	splash,
	wipe
};

export { notify as default };