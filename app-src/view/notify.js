/**
 * Provides an API for handling html based notifications
 */
import Element from '../tools/element';

const SETUP = {
	id: 'notify'
};

let parentElement = new Element({ id: SETUP.id }).node,
	content;

/**
 * Adds written content onto display
 * @param {object} data
 */
function splash(data) {
	if (typeof data !== 'object' || !data.html) { return; }

	if (content) {
		wipe();
	}

	content = new Element();
	content.node.innerHTML = data.html;
	parentElement.appendChild(content.node);
}

/**
 * Removes written content
 */
function wipe () {
	parentElement.removeChild(content.node);
	content = null;
}

const notify = {
	parentElement,
	splash,
	wipe
};

export { notify as default };