/**
 * Handles all our media object and requests
 */
import Element from '../tools/element';
import { ajaxRequest } from '../tools/common';
import gui from './components/media_gui';
import storyBehaviour from '../configs/storyBehaviour';

const SETUP = {
	id   : 'mediaGroup',
	class: 'scaleToParent'
};
const MILLISECONDS_IN_SECONDS = 1000;
const MEDIA_BEHAVIOUR = storyBehaviour.media;

let parentElement = new Element({ id: SETUP.id, class: SETUP.class }).node,
	mediaObject = {};

/**
 * Media object super class
 *
 */
class MediaObject {

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

/**
 * Video element child class
 *
 */
class Video extends MediaObject {

	/**
	 * @param {object} object
	 */
	constructor (object) {
		super(object);
		this.element = new Element({ type: 'video', id: 'video' });
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

					this.sources.ogg = new Element({ type: 'source'})
						.setAttributes({
							'src' : source,
							'type': 'video/ogg'
						});

					this.element.node.appendChild(this.sources.ogg.node);
				})
				.catch(() => {
					this.sources.ogg = false;
				});
		}

		if (typeof this.sources.mp4 === 'string' && this.sources.mp4 !== '') {
			ajaxRequest(this.sources.mp4)
				.then(() => {
					let source = this.sources.mp4;

					this.sources.mp4 = new Element('source')
						.setAttributes({
							'src' : source,
							'type': 'video/mp4'
						});

					this.element.node.appendChild(this.sources.mp4.node);
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

		this.element.setAttributes({
			width,
			height
		});

		return this;
	}
}

/**
 * Audio element child class
 *
 */
class Audio extends MediaObject {

	/**
	 * @param {object} object
	 */
	constructor (object) {
		super(object);
		this.element = new Element({ type: 'audio', id: 'audio' });
	}
}

/**
 * Sends a custom event message with the media state
 * @param {string} state
 * @private
 */
function _broadcastMediaState(state) {
	let event = new CustomEvent('media:state:change', {
		detail: {
			state,
			time: _getCurrentTime()
		}
	});

	parentElement.dispatchEvent(event);
}

/**
 * Listen to media events
 * @private
 */
function _listenToMediaEvents() {
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

		mediaObject.element.node.addEventListener(event, () => {
			_broadcastMediaState(event);
		});
	}
}

/**
 * Returns current play position of media object
 * @returns {number}
 */
function _getCurrentTime() {
	return mediaObject.element.node.currentTime * MILLISECONDS_IN_SECONDS;
}

/**
 * Returns length of media object
 * @returns {number}
 */
function _getLength() {
	return mediaObject.element.node.duration;
}

/**
 * Plays the current media object
 *
 */
function _play() {
	mediaObject.element.node.play();
}

/**
 * Pauses the current media object
 *
 */
function _pause() {
	mediaObject.element.node.pause();
}

/**
 * Toggles between media play and pause state and returns the new state
 * @returns {boolean}
 */
function _playPause() {

	if (mediaObject.element.node.paused) {
		mediaObject.element.node.play();
		return true;
	}

	mediaObject.element.node.pause();
	return false;
}

/**
 * Seek to the media time
 * @param {number} time (seconds)
 */
function _seek(time) {
	mediaObject.element.node.currentTime = time;
}

const media = {

	parentElement,
	getCurrentTime: _getCurrentTime,
	getLength     : _getLength,
	play          : _play,
	pause         : _pause,
	playPause     : _playPause,
	seek          : _seek,

	/**
	 * Creates a media object and posts it to the DOM
	 * @param {object} media
	 * @returns {boolean}
	 */
	initialise(media) {
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

		parentElement.appendChild(mediaObject.element.node);

		_listenToMediaEvents();
		gui.initialise();

		return true;
	}
};

export { media as default };