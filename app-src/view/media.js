/**
 * Handles all our media object and requests
 *
 */

import { ajaxRequest, element } from '../tools/common';

let parentElement = element.create({ id: 'mediaGroup' }),
	mediaObject = {};

const MILLISECONDS_IN_SECONDS = 1000;

/**
 * Media object super class
 *
 */
class MediaObject {

	/**
	 * Constructor function
	 *
	 * @param {Object} object
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
	 *
	 * @returns {Object} this
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
		this.element.controls = this.controls;

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
	 *
	 * @param {Object} object
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
	 * Check if exists and set the video element sources
	 *
	 * @returns {Object} this
	 */
	setSources () {
		if (typeof this.sources.ogg === 'string' && this.sources.ogg !== '') {
			ajaxRequest(this.sources.ogg)
				.then(() => {
					let source = this.sources.ogg;

					this.sources.ogg = element.create({ type: 'source'});
					element.attributes(this.sources.ogg, [
						['src', source],
						['type', 'video/ogg']
					]);
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
					element.attributes(this.sources.mp4, [
						['src', source],
						['type', 'video/mp4']
					]);
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
	 *
	 * @param {Number} width
	 * @param {Number} height
	 *
	 * @returns {Object} this
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
	 *
	 * @param {Object} object
	 */
	constructor (object) {
		super(object);
		this.element = element.create({ type: 'audio', id: 'audio' });
	}
}

/**
 * Sends a custom event message with the media state
 * @param {String} state
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
 *
 * @returns {Number}
 */
function getCurrentTime() {
	return mediaObject.element.currentTime * MILLISECONDS_IN_SECONDS;
}

/**
 * Returns length of media object
 *
 * @returns {Number}
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
 * @param {Number} time (seconds)
 */
function seek(time) {
	mediaObject.element.currentTime = time;
}

const media = {

	/**
	 * Creates a media object and posts it to the DOM
	 *
	 * @param {Object} media
	 * @param {Function} callback
	 *
	 */
	initialise: (media, callback) => {

		let initialised;

		switch (media.type) {
			case 'video':
				mediaObject = new Video(media)
					.setAttributes()
					.setSources()
					.setDimensions(800, 800);

				initialised = true;
				break;

			case 'audio':
				mediaObject = new Audio(media);
				initialised = true;
				break;

			default:
				initialised = false;
		}

		parentElement.appendChild(mediaObject.element);

		listenToMediaEvents();

		callback(initialised, media.autoplay);
	},

	parentElement,
	getCurrentTime,
	getLength,
	play,
	pause,
	seek
};

export { media as default };