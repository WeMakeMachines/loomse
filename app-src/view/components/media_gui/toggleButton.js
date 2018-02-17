import Button from './button';

/**
 * Button extension which allows for toggling behaviours
 */
export default class ToggleButton extends Button {

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
