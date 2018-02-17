/**
 * Handles all our media object and requests
 */
import element from '../element';
import gui from '../media_gui/media_gui';

import Video from './Video';
import Audio from './Audio';

const SETUP = {
	id   : 'mediaGroup',
	class: 'scaleToParent'
};

const MILLISECONDS_IN_SECONDS = 1000;

let parentElement = element({ id: SETUP.id })
		.setClass(SETUP.class),
	mediaObject = {};

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

	parentElement.node.dispatchEvent(event);
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

		parentElement.attach(mediaObject.element);

		_listenToMediaEvents();
		gui.initialise();

		return true;
	}
};

export { media as default };
