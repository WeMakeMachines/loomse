/**
 * Handles all user friendly notifications
 *
 */

import { element } from '../tools/common';

const SETUP = {
	id: 'notify'
};

let parentElement = element.create({ id: SETUP.id }),
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