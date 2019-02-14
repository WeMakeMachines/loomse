import Component from '../Abstract';

/**
 * Provides an API for handling modal dialogs
 */
export class Modal extends Component {

	constructor(options) {
		super(options);
		this.content = null;
	}

	/**
	 * Adds written content onto display
	 * @param {object} data
	 */
	updateContent(data) {
		if (typeof data !== 'object' || !data.html) { return; }

		if (this.content) {
			this.setHtml('');
		}

		this.content = Component.createNode()
			.setHtml(data.html);

		this.node.attach(this.content);
	}

	/**
	 * Adds click listeners to html buttons
	 * @param {object} callbacks
	 */
	attachCallbacksToButtons(callbacks) {
		for (let key in callbacks) {
			if (callbacks.hasOwnProperty(key)) {
				let callback = callbacks[key],
					button = document.getElementById(callback.id);

				button.addEventListener('click', callback.action);
			}
		}
	}
}
