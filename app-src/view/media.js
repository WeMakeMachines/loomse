// Handles all our media object and requests

import { ajaxRequest, newObject, report } from '../tools/common';
import config from '../config';
import notify from './notify';
import subtitles from './subtitles';

export default (function () {

	let container = newObject('div', { id: 'mediaGroup' }),
		mediaObject = {};

	/**
	 * Creates a media object and posts it to the DOM
	 *
	 * @param {Object} media
	 * @param {Function} callback
	 *
	 * @returns {Boolean}
	 */
	function initialise(media, callback) {

		mediaObject = {};

		switch (media.type) {
			case 'video':
				mediaObject = new Video(media)
					.setAttributes()
					.setSources()
					.setDimensions(800, 800);

				break;

			case 'audio':
				mediaObject = new Audio(media);
				break;

			default:
				return false;
		}

		container.appendChild(mediaObject.element);

		if (callback) {	callback();	}

		return true;
	}

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
			this.element = newObject('video', { id: 'video' });
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
						this.sources.ogg = newObject('source', {
							attributes: [
								['src', this.sources.ogg],
								['type', 'video/ogg']
							]
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
						this.sources.mp4 = newObject('source', {
							attributes: [
								['src', this.sources.mp4],
								['type', 'video/mp4']
							]
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
			this.element = newObject('audio', { id: 'audio' });
		}
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
	 * Returns current play position of media object
	 *
	 * @returns {Number}
	 */
	function getCurrentTime() {
		return mediaObject.element.currentTime;
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
	 * Calculates the best size for the media
	 *
	 */
	function calculateDimensions() {

	}

	/////// old code below this line

	// function calcVideoSize(nativeWidth, nativeHeight, hostWidth, hostHeight) {
	//
	// 	let ratio;
	//
	// 	// first see if we need to scale down or up, depending on the size of video
	// 	// and host device properties
	//
	// 	if (nativeWidth <= hostWidth && nativeHeight <= hostHeight) {
	// 		// scale up
	//
	// 		// first find out if the video should be scaled up from the
	// 		// width or the height
	// 		if (hostWidth / nativeWidth > hostHeight / nativeHeight) {
	// 			ratio = hostHeight / nativeHeight;
	// 		} else {
	// 			ratio = hostWidth / nativeWidth;
	// 		}
	// 	} else {
	// 		// scale down
	// 		if (nativeWidth / hostWidth > nativeHeight / hostHeight) {
	// 			ratio = nativeHeight / hostHeight;
	// 		} else {
	// 			ratio = nativeWidth / hostWidth;
	// 		}
	// 	}
	//
	// 	return {
	// 		height: ratio * nativeHeight,
	// 		width : ratio * nativeWidth
	// 	};
	// }
	//
	// let object = {};
	//
	// // internal watcher to keep track of the current time - if it stops, we know then that playback has been interrupted
	// let poll = (function () {
	// 	let pollEvent,
	// 		pollInterval = 300,
	// 		playbackStopEvents = 0,
	// 		playBackStopState = false;
	//
	// 	return {
	// 		run: function (object) {
	// 			let oldTime = object.currentTime,
	// 				newTime;
	//
	// 			pollEvent = setInterval(function () {
	// 				newTime = object.currentTime;
	// 				// perform analysis
	// 				if (oldTime !== newTime) {
	// 					// all ok
	// 					if (playBackStopState === true) {
	// 						playBackStopState = false;
	// 						notify.dismiss();
	// 					}
	// 					oldTime = newTime;
	// 				} else {
	// 					// else do this if playback has stopped
	// 					if (config.behaviour.developer.verbose === 'full' || config.behaviour.developer.verbose === 'minimal') {
	// 						report('[Poll] Video has stopped playing.');
	// 					}
	// 					if (playBackStopState === false) { // check if it hasn't stopped before
	// 						if (config.behaviour.developer.verbose === 'full' || config.behaviour.developer.verbose === 'minimal') {
	// 							report('[Poll] This is the first time the video has stopped without user input.');
	// 						}
	// 						playbackStopEvents = playbackStopEvents + 1;
	// 					}
	// 					playBackStopState = true;
	// 					notify.push('Buffering');
	// 				}
	// 			}, pollInterval);
	// 		},
	// 		end: function () {
	// 			clearInterval(pollEvent);
	// 		}
	// 	};
	// }());
	//
	// // external functions and variables
	//
	// function target(sceneId) {
	// 	let parent = document.getElementById(sceneId),
	// 		media = parent.media,
	// 		selection;
	// 	switch (media) {
	// 		case 'video':
	// 			selection = document.querySelector('video');
	// 			break;
	// 		case 'audio':
	// 			selection = document.querySelector('audio');
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// 	return selection;
	// }
	//
	// function pause() {
	// 	if (object.paused === false) {
	// 		poll.end();
	// 		object.pause();
	// 		notify.push('Paused', 'paused');
	// 	}
	// }
	//
	// function play(timecode) {
	// 	poll.end();
	// 	notify.dismiss();
	// 	// check if a timecode has been specified, and if it is within range
	// 	if (timecode && timecode > 0 && timecode < object.duration) {
	// 		object.currentTime = timecode;
	// 	}
	// 	object.play();
	// 	poll.run(object);
	//
	// 	// everytime the timecode changes, the following series of actions are taken:
	// 	//  - check to see if any subtitle needs displaying
	// 	//  - check to see if a scene event needs to be fired
	// 	//  - update progress bar
	// 	object.ontimeupdate = function () {
	// 		// I begin my watch...
	// 		subtitles.check(object.currentTime);
	// 		//gui.updateProgressBar();
	// 	};
	// }
	//
	// function listen(callback) {
	// 	// add an event listener
	//
	// 	object.addEventListener('timeupdate', function () {
	// 		callback(object.currentTime);
	// 	});
	// }

	return {
		container     : container,
		initialise    : initialise,
		play          : play,
		pause         : pause,
		getLength     : getLength,
		getCurrentTime: getCurrentTime
		// target        : target,
		// listen        : listen,
		//object        : object,
	};
}());
