/**
 * Handles all our media object and requests
 */
import { element } from '../../View/element';
// import gui from '../Buttons/Gui';

import Video from './Video';
import Audio from './Audio';

export class Media {

	/**
	 * Creates a Media object and posts it to the DOM
	 * @param {object} options
	 */
	constructor(options) {
		this.id = 'media';
		this.class = '';
		this.media = options.media;

		this.element = element({ id: this.id })
			.setClass(this.class);

		if (this.media.type === 'video') {
			this.mediaObject = new Video(this.media)
				.setAttributes()
				.setSources()
				.fillMethod();
		}

		if (this.media.type === 'audio') {
			this.mediaObject = new Audio(this.media);
		}

		//this.gui = new Buttons();

		this.element.attach(this.mediaObject.element);

		this.listenToMediaEvents();
		//gui.initialise();
	}

	/**
	 * Listen to Media events
	 * @private
	 */
	listenToMediaEvents() {
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

			this.mediaObject.element.node.addEventListener(event, () => {
				this.broadcastMediaState(event);
			});
		}
	}

	/**
	 * Sends a custom Event message with the Media state
	 * @param {string} state
	 * @private
	 */
	broadcastMediaState(state) {
		let event = new CustomEvent('Media:state:change', {
			detail: {
				state,
				time: this.getCurrentTime()
			}
		});

		this.element.node.dispatchEvent(event);
	}

	/**
	 * Returns current play position of Media object
	 * @returns {number}
	 */
	getCurrentTime() {
		const millisecondsInSeconds = 1000;
		return this.mediaObject.element.node.currentTime * millisecondsInSeconds;
	}

	/**
	 * Returns length of Media object
	 * @returns {number}
	 */
	getLength() {
		return this.mediaObject.element.node.duration;
	}

	/**
	 * Plays the current Media object
	 *
	 */
	play() {
		this.mediaObject.element.node.play();
	}

	/**
	 * Pauses the current Media object
	 *
	 */
	pause() {
		this.mediaObject.element.node.pause();
	}

	/**
	 * Toggles between Media play and pause state and returns the new state
	 * @returns {boolean}
	 */
	playPause() {

		if (this.mediaObject.element.node.paused) {
			this.mediaObject.element.node.play();
			return true;
		}

		this.mediaObject.element.node.pause();
		return false;
	}

	/**
	 * Seek to the Media time
	 * @param {number} time (seconds)
	 */
	seek(time) {
		this.mediaObject.element.node.currentTime = time;
	}
}
