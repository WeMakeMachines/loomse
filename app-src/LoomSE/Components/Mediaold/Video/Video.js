import element from '../../../../tools/element';
import { ajaxRequest } from '../../../../tools/common';

import Abstract from '../Abstract/Abstract';
import storyBehaviour from '../../../../../configs/storyBehaviour.json';
import state from '../../../state';

const MEDIA_BEHAVIOUR = storyBehaviour.media;

/**
 * Video element child class
 *
 */
export class Video extends Abstract {

	/**
	 * @param {object} object
	 */
	constructor (object) {
		super(object);
		this.element = element({ type: 'video', id: 'video' });
		this.sources = {
			ogg: object.video.ogg || false,
			mp4: object.video.mp4 || false
		};
	}

	/**
	 * Sets up CSS fill method
	 * @returns {object} this
	 */
	fillMethod () {
		switch (MEDIA_BEHAVIOUR.videoFillMethod) {
			case 'cover':
				this.element.setStyle({
					'object-fit': 'cover'
				});
				break;
			default:
				this.element.setStyle({
					'object-fit': 'contain'
				});
				break;
		}

		return this;
	}

	/**
	 * Check if exists and set the video element sources
	 * @returns {object} this
	 */
	setSources () {
		if (typeof this.sources.ogg === 'string' && this.sources.ogg !== '') {

			ajaxRequest(this.sources.ogg)
				.then(() => {
					let source = this.sources.ogg;

					this.sources.ogg = element({ type: 'source'})
						.setAttributes({
							'src' : source,
							'type': 'video/ogg'
						});

					this.element.attach(this.sources.ogg);
				})
				.catch(() => {
					this.sources.ogg = false;
				});
		}

		if (typeof this.sources.mp4 === 'string' && this.sources.mp4 !== '') {
			ajaxRequest(this.sources.mp4)
				.then(() => {
					let source = this.sources.mp4;

					this.sources.mp4 = element('source')
						.setAttributes({
							'src' : source,
							'type': 'video/mp4'
						});

					this.element.attach(this.sources.mp4);
				})
				.catch(() => {
					this.sources.mp4 = false;
				});
		}

		return this;
	}

	/**
	 * Sets the width and height attribute of the Media object
	 * @param {number} width
	 * @param {number} height
	 * @returns {object} this
	 */
	setDimensions (width, height) {

		this.element.setAttributes({
			width,
			height
		});

		return this;
	}
}
