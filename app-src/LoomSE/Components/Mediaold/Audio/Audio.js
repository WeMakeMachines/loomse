import element from '../../../../tools/element';

import Abstract from '../Abstract';

/**
 * Audio element child class
 *
 */
export class Audio extends Abstract {

	/**
	 * @param {object} object
	 */
	constructor (object) {
		super(object);
		this.element = element({ type: 'audio', id: 'audio' });
	}
}
