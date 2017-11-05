/**
 * Subtitles handling and rendering
 * Since subtitles appear in a linear fashion (the next one always follows the previous one),
 * -> we always keep on record the current subtitle to be displayed
 */
import Element from '../tools/element';
import config from '../configs/config';
import data from '../model/data';
import { report } from '../tools/common';
import storyBehaviour from '../configs/storyBehaviour';

const SETUP = {
	id: 'subtitles'
};

let parentElement = new Element({ id: SETUP.id }).node;

/**
 * Append our subtitle to the DOM (show the subtitle)
 * @param {string} phrase
 */
function display(phrase) {

	remove();

	let newSubtitle = new Element({type: 'p', classList: 'subtitle' }),
		text = document.createTextNode(phrase);

	if (config.developer.checkVerbose('subtitles')) {
		report(`[Subtitle] ${phrase}`);
	}

	newSubtitle.node.appendChild(text);

	newSubtitle.getDimensions()
		.calculatePosition(data.dimensions, storyBehaviour.subtitles.x, storyBehaviour.subtitles.y)
		.setPosition();

	parentElement.appendChild(newSubtitle.node);
}

/**
 * Removes a subtitle
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