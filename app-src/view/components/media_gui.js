/**
 * On screen media controls
 *
 */

import { element } from '../../tools/common';
import { fullScreen } from '../../tools/browser';
import html from '../../templates/media_gui.html';
import media from '../media';

const SETUP = {
	id: 'mediaGui'
};

let parentElement = element.create({ id: SETUP.id }),
	playButton = '.play_toggle',
	fullScreenButton = '.fullscreen_toggle';

/**
 * Button class
 *
 */
class Button {

	/**
	 * Constructor function
	 * @param {object} object
	 */
	constructor (object) {
		this.toggle = object.toggle;
		this.node = object.node;
		this.onElement = this.node.querySelector('.on');
		this.offElement = this.node.querySelector('.off');
		this.action = object.action;
		this.node.onclick = () => {
			let state = this.action();

			if (state && this.toggle) {
				this.toggleOn();
			} else if (!state && this.toggle) {
				this.toggleOff();
			}
		};
	}

	/**
	 * Toggles the graphic 'on'
	 */
	toggleOn() {
		this.onElement.classList.add('hide');
		this.offElement.classList.remove('hide');
	}

	/**
	 * Toggles the graphic 'off'
	 */
	toggleOff() {
		this.onElement.classList.remove('hide');
		this.offElement.classList.add('hide');
	}
}

/**
 * Sets the buttons and associated events
 * @param {object} fragment
 * @private
 */
function _prepareButtons(fragment) {

	playButton = new Button({
		toggle: true,
		node  : fragment.querySelector(`${playButton}`),
		action: () => media.playPause()
	});

	fullScreenButton = new Button({
		node  : fragment.querySelector(`${fullScreenButton}`),
		action: () => fullScreen.toggle()
	});

}

const mediaGui = {
	initialise: () => {
		let fragment = document.createDocumentFragment(),
			guiContainer = document.createElement('div');

		guiContainer.innerHTML = html;

		fragment.appendChild(guiContainer);

		_prepareButtons(fragment);

		parentElement.appendChild(fragment);
	},
	parentElement
};

export { mediaGui as default };