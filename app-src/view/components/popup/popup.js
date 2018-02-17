/**
 * Provides an API for handling html based popups
 */
import element from '../element';

const SETUP = {
	id: 'popup'
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

	if (data.callbacks) {
		attachCallbacksToButtons(data.callbacks);
	}
}

/**
 * Adds click listeners to html buttons
 * @param {object} callbacks
 */
function attachCallbacksToButtons(callbacks) {
	for (let key in callbacks) {
		if (callbacks.hasOwnProperty(key)) {
			let callback = callbacks[key],
				button = document.getElementById(callback.id);

			button.addEventListener('click', callback.action);
		}
	}
}

/**
 * Removes written content
 */
function wipe () {

	parentElement.detach(content);
	content = null;
}

const popup = {
	parentElement,
	splash,
	wipe
};

export { popup as default };
