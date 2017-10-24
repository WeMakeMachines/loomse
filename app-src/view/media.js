/**
 * Handles all our media object and requests
 *
 */

import { ajaxRequest, element } from '../tools/common';
import gui from './components/media_gui';
import storyBehaviour from '../configs/storyBehaviour';

const SETUP = {
	id   : 'mediaGroup',
	class: 'scaleToParent'
};
const MILLISECONDS_IN_SECONDS = 1000;
const MEDIA_BEHAVIOUR = storyBehaviour.media;

let parentElement = element.create({ id: SETUP.id, class: SETUP.class }),
	mediaObject = {};

/**
 * Media object super class
 *
 */
class MediaObject {

	/**
	 * Constructor function
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
					this.element.setAttribute('poster', this.poster);
				})
				.catch(() => {
					this.poster = false;
				});
		}

		// set muted
		this.element.muted = this.muted;

		// set controls
		this.element.controls = false;

		return this;
	}
}

/**
 * Video element child class
 *
 */
class Video extends MediaObject {

	/**
	 * Constructor function
	 * @param {object} object
	 */
	constructor (object) {
		super(object);
		this.element = element.create({ type: 'video', id: 'video' });
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
				element.style(this.element, {
					'object-fit': 'cover'
				});
				break;
			default:
				element.style(this.element, {
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

					this.sources.ogg = element.create({ type: 'source'});
					element.attributes(this.sources.ogg, {
						'src' : source,
						'type': 'video/ogg'
					});
					this.element.appendChild(this.sources.ogg);
				})
				.catch(() => {
					this.sources.ogg = false;
				});
		}

		if (typeof this.sources.mp4 === 'string' && this.sources.mp4 !== '') {
			ajaxRequest(this.sources.mp4)
				.then(() => {
					let source = this.sources.ogg;

					this.sources.mp4 = element.create('source');
					element.attributes(this.sources.mp4, {
						'src' : source,
						'type': 'video/mp4'
					});
					this.element.appendChild(this.sources.mp4);
				})
				.catch(() => {
					this.sources.mp4 = false;
				});
		}

		return this;
	}

	/**
	 * Sets the width and height attribute of the media object
	 * @param {number} width
	 * @param {number} height
	 * @returns {object} this
	 */
	setDimensions (width, height) {

		this.element.setAttribute('width', width);
		this.element.setAttribute('height', height);

		return this;
	}
}

/**
 * Audio element child class
 *
 */
class Audio extends MediaObject {

	/**
	 * Constructor function
	 * @param {object} object
	 */
	constructor (object) {
		super(object);
		this.element = element.create({ type: 'audio', id: 'audio' });
	}
}

/**
 * Sends a custom event message with the media state
 * @param {string} state
 */
function broadcastMediaState(state) {
	let event = new CustomEvent('media:state:change', {
		detail: {
			state,
			time: getCurrentTime()
		}
	});

	parentElement.dispatchEvent(event);
}

/**
 * Listen to media events
 *
 */
function listenToMediaEvents() {
	let events = [
		'playing',
		'paused',
		'seeking',
		'seeked',
		'timeupdate',
		'ended'
	];

	for (let i = 0; i < events.length; i += 1) {
		let event = events[i];

		mediaObject.element.addEventListener(event, () => {
			broadcastMediaState(event);
		});
	}
}

/**
 * Returns current play position of media object
 * @returns {number}
 */
function getCurrentTime() {
	return mediaObject.element.currentTime * MILLISECONDS_IN_SECONDS;
}

/**
 * Returns length of media object
 * @returns {number}
 */
function getLength() {
	return mediaObject.element.duration;
}

/**
 * Plays the current media object
 *
 */
function play() {
	mediaObject.element.play();
}

/**
 * Pauses the current media object
 *
 */
function pause() {
	mediaObject.element.pause();
}

/**
 * Seek to the media time
 * @param {number} time (seconds)
 */
function seek(time) {
	mediaObject.element.currentTime = time;
}

const media = {

	/**
	 * Creates a media object and posts it to the DOM
	 * @param {object} media
	 * @returns {boolean}
	 */
	initialise: (media) => {
		switch (media.type) {
			case 'video':
				mediaObject = new Video(media)
					.setAttributes()
					.setSources()
					.fillMethod();
				break;

			case 'audio':
				mediaObject = new Audio(media);
				break;

			default:
				return false;
		}

		parentElement.appendChild(mediaObject.element);

		listenToMediaEvents();
		gui.initialise();

		return true;
	},

	parentElement,
	getCurrentTime,
	getLength,
	play,
	pause,
	seek
};

export { media as default };