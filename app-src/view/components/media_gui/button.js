/**
 * Button super class
 *
 */
export default class Button {

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
