/**
 * Subtitles handling and rendering
 * Since subtitles appear in a linear fashion (the next one always follows the previous one),
 * -> we always keep on record the current subtitle to be displayed
 *
 */

import { element, report } from '../tools/common';
import config from '../configs/config';

const SETUP = {
	id: 'subtitles'
};

let parentElement = element.create({ id: SETUP.id }),
	subtitle = element.create({type: 'p'});


/**
 * Append our subtitle to the DOM (show the subtitle)
 * @param {String} phrase
 */
function display(phrase) {
	if (config.developer.checkVerbose('subtitles')) {
		report(`[Subtitle] ${phrase}`);
	}
	subtitle.innerHTML = phrase;
	parentElement.appendChild(subtitle);
}

/**
 * Removes a subtitle
 * If no time is specified, the function defaults to removing the current existing subtitle
 * @param {Number} time
 */
function remove(time) {
	parentElement.innerHTML = '';
}

const subtitles = {

	parentElement,
	display,
	remove
};

export { subtitles as default };