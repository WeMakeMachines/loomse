/**
 * On screen media controls
 */
import { browser } from '../../tools/browser';
import { element } from '../../tools/common';
import html from '../../templates/media_gui.html';
import media from '../media';

const SETUP = {
	id: 'mediaGui'
};

let parentElement = element.create({ id: SETUP.id }),
	playButton = '.play_toggle',
	fullScreenButton = '.fullscreen_toggle';

/**
 * Button super class
 *
 */
class Button {

	/**
	 * @param {object} object
	 */
	constructor (object) {
		this.toggle = object.toggle;
		this.node = object.node;
		this.onElement = this.node.querySelector('.on');
		this.offElement = this.node.querySelector('.off');
		this.action = object.action;
		this.node.onclick = () => {
			this.action();
		};
	}
}

/**
 * Button extension which allows for toggling behaviours
 */
class ToggleButton extends Button {

	/**
	 * @param {object} object
	 */
	constructor (object) {
		super(object);
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

const mediaGui = {

	parentElement,

	initialise: () => {
		let fragment = document.createDocumentFragment(),
			guiContainer = document.createElement('div');

		guiContainer.innerHTML = html;

		fragment.appendChild(guiContainer);

		_prepareButtons(fragment);

		parentElement.appendChild(fragment);
	}
};

export { mediaGui as default };