import element from '../element';
import media from '../media/media';

import { browser } from '../../../tools/browser';

import ToggleButton from './toggleButton';
import html from './html/media_gui.html';

/**
 * On screen media controls
 */
const SETUP = {
	id: 'mediaGui'
};

let parentElement = element({ id: SETUP.id }),
	playButton = '.play_toggle',
	fullScreenButton = '.fullscreen_toggle';

/**
 * Sets the buttons and associated events
 * @param {object} fragment
 * @private
 */
function _prepareButtons(fragment) {

	playButton = new ToggleButton({
		toggle: true,
		node  : fragment.querySelector(`${playButton}`),
		action: () => media.playPause()
	});

	fullScreenButton = new ToggleButton({
		node  : fragment.querySelector(`${fullScreenButton}`),
		action: () => browser.fullscreen.toggle()
	});
}

export default {

	parentElement,

	initialise() {
		let fragment = document.createDocumentFragment(),
			guiContainer = element()
				.setHtml(html);

		fragment.appendChild(guiContainer.node);

		_prepareButtons(fragment);

		parentElement.attach(fragment);
	}
};
