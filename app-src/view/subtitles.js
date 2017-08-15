/**
 * Subtitles handling and rendering
 * Since subtitles appear in a linear fashion (the next one always follows the previous one),
 * -> we always keep on record the current subtitle to be displayed
 *
 */

import { element, report } from '../tools/common';
import config from '../configs/config';

const SETUP = {
	parent: {
		id   : 'subtitles',
		class: 'subtitle'
	}
};

let parentElement = element.create({ id: SETUP.parent.id, class: SETUP.parent.class });

/**
 * Append our subtitle to the DOM (show the subtitle)
 * @param {String} phrase
 */
function display(phrase) {
	let newSubtitle = element.create({type: 'p'}),
		text = document.createTextNode(phrase);

	if (config.developer.checkVerbose('subtitles')) {
		report(`[Subtitle] ${phrase}`);
	}

	remove();

	newSubtitle.appendChild(text);
	parentElement.appendChild(newSubtitle);
}

/**
 * Removes a subtitle
 *
 */
function remove() {
	let oldSubtitle = parentElement.firstElementChild;

	if (oldSubtitle) {
		parentElement.removeChild(oldSubtitle);
	}
}

const subtitles = {

	parentElement,
	display,
	remove
};

export { subtitles as default };