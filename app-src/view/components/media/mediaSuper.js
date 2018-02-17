import { ajaxRequest } from '../../../tools/common';

/**
 * Media object super class
 *
 */
export default class MediaSuper {

	/**
	 * @param {object} object
	 */
	constructor (object) {
		this.loop = object.loop;
		this.autoplay = object.autoplay;
		this.muted = object.muted || false;
		this.poster = object.poster;
		this.controls = object.controls;
	}

	/**
	 * Sets attribute for the element
	 * poster / muted / controls
	 * @returns {object} this
	 */
	setAttributes () {
		// check if poster exists and set
		if (typeof this.poster === 'string' && this.poster !== '') {
			ajaxRequest(this.poster)
				.then(() => {
					this.element.node.setAttribute('poster', this.poster);
				})
				.catch(() => {
					this.poster = false;
				});
		}

		// set muted
		this.element.node.muted = this.muted;

		// set controls
		this.element.node.controls = false;

		return this;
	}
}
