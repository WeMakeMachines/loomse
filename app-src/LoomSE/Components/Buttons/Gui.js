import element from '../../../tools/element';
import Toggle from './Toggle';

import mediaGuiHtml from '../../../html/media_gui.html';

/**
 * On screen Media controls
 */
// const SETUP = {
// 	id: 'mediaGui'
// };
//
// let parentElement = element({ id: SETUP.id }),
// 	playButton = '.play_toggle',
// 	fullScreenButton = '.fullscreen_toggle';
//
// /**
//  * Sets the buttons and associated events
//  * @param {object} fragment
//  * @private
//  */
// function _prepareButtons(fragment) {
//
// 	playButton = new Toggle({
// 		toggle: true,
// 		node  : fragment.querySelector(`${playButton}`),
// 		action: () => media.playPause()
// 	});
//
// 	fullScreenButton = new Toggle({
// 		node  : fragment.querySelector(`${fullScreenButton}`),
// 		action: () => browser.fullscreen.toggle()
// 	});
// }
//
// export default {
//
// 	parentElement,
//
// 	initialise() {
// 		let fragment = document.createDocumentFragment(),
// 			guiContainer = element()
// 				.setHtml(html);
//
// 		fragment.appendChild(guiContainer.node);
//
// 		_prepareButtons(fragment);
//
// 		parentElement.attach(fragment);
// 	}
// };

/**
 * On screen Media controls
 */
export default class Gui {
	/**
	 * @param {object} html
	 */
	constructor(html = mediaGuiHtml) {
		this.id = 'mediaGui';
		this.container = element({ id: this.id });

		this.html = element().setHtml(html);

		this.container.appendChild(this.html.node);
	}

	/**
	 * Attaches a button to the gui
	 * @param {string} selector
	 * @param {function} action
	 * @param {boolean} toggle
	 * @returns {Toggle}
	 */
	attachButton(selector, action, toggle) {
		toggle = toggle || false;

		const selection = this.html.querySelector(`${selector}`);

		if (!selection) {
			throw new Error('[Buttons] Unable to attach action to button');
		}

		return new Toggle({
			node: selection,
			action: () => action(),
			toggle
		});
	}
}
