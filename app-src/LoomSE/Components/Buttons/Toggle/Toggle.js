import Abstract from '../Abstract';

/**
 * Button extension which allows for toggling behaviours
 */
export class Toggle extends Abstract {
	/**
	 * @param {object} object
	 */
	constructor(object) {
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
