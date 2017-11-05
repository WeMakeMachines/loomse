/**
 * Provides an API for handling html based notifications
 */
import element from '../tools/element';

const SETUP = {
	id: 'notify'
};

let parentElement = element({ id: SETUP.id }),
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

	content = element()
		.setHtml(data.html);

	parentElement.attach(content);
}

/**
 * Removes written content
 */
function wipe () {

	parentElement.detach(content);
	content = null;
}

const notify = {
	parentElement,
	splash,
	wipe
};

export { notify as default };