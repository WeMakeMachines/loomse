/**
 * Subtitles handling and rendering
 * Since subtitles appear in a linear fashion (the next one always follows the previous one),
 * -> we always keep on record the current subtitle to be displayed
 */
import element from './components/element';
import config from '../configs/config';
import data from '../model/data';
import { report } from '../tools/common';
import storyBehaviour from '../configs/storyBehaviour';

const SETUP = {
	id: 'subtitles'
};

let parentElement = element({ id: SETUP.id });

/**
 * Append our subtitle to the DOM (show the subtitle)
 * @param {string} phrase
 */
function display(phrase) {

	remove();

	if (config.developer.checkVerbose('subtitles')) {
		report(`[Subtitle] ${phrase}`);
	}

	let newSubtitle = element({type: 'p'})
		.setClass('subtitle')
		.setText(phrase)
		.setPosition(data.dimensions, storyBehaviour.subtitles.x, storyBehaviour.subtitles.y);

	parentElement.attach(newSubtitle);
}

/**
 * Removes a subtitle
 */
function remove() {

	let oldSubtitle = parentElement.node.firstElementChild;

	if (oldSubtitle) {
		parentElement.detach(oldSubtitle);
	}
}

const subtitles = {
	parentElement,
	display,
	remove
};

export { subtitles as default };