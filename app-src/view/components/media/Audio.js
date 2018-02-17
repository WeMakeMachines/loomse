import element from '../element';

import MediaSuper from './mediaSuper';

/**
 * Audio element child class
 *
 */
export default class Audio extends MediaSuper {

	/**
	 * @param {object} object
	 */
	constructor (object) {
		super(object);
		this.element = element({ type: 'audio', id: 'audio' });
	}
}
