/**
 * On screen media controls
 *
 */

import { element } from '../../tools/common';
import html from '../../templates/media_gui.html';

const SETUP = {
	id: 'mediaGui'
};

const buttons = {
	play      : null,
	fullscreen: null
};

let parentElement = element.create({ id: SETUP.id });

const mediaGui = {
	initialise: () => {
		parentElement.innerHTML = html;
	},
	parentElement
};

export { mediaGui as default };