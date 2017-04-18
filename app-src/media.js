// Handles all our media object and requests

import config from './config';
import notify from './notify';
import subtitles from './subtitles';
import view from './view/controller';

export default (function () {

	let object = {};

	// internal watcher to keep track of the current time - if it stops, we know then that playback has been interrupted
	let poll = (function () {
		let pollEvent,
			pollInterval = 300,
			playbackStopEvents = 0,
			playBackStopState = false;

		return {
			run: function (object) {
				let oldTime = object.currentTime,
					newTime;

				pollEvent = setInterval(function () {
					newTime = object.currentTime;
					// perform analysis
					if (oldTime !== newTime) {
						// all ok
						if (playBackStopState === true) {
							playBackStopState = false;
							notify.dismiss();
						}
						oldTime = newTime;
					} else {
						// else do this if playback has stopped
						if (config.behaviour.developer.verbose === 'full' || config.behaviour.developer.verbose === 'minimal') {
							console.log('[Poll] Video has stopped playing.');
						}
						if (playBackStopState === false) { // check if it hasn't stopped before
							if (config.behaviour.developer.verbose === 'full' || config.behaviour.developer.verbose === 'minimal') {
								console.log('[Poll] This is the first time the video has stopped without user input.');
							}
							playbackStopEvents = playbackStopEvents + 1;
						}
						playBackStopState = true;
						notify.push('Buffering');
					}
				}, pollInterval);
			},
			end: function () {
				clearInterval(pollEvent);
			}
		};
	}());

	// external functions and variables

	function target(sceneId) {
		let parent = document.getElementById(sceneId),
			media = parent.media,
			selection;
		switch (media) {
			case 'video':
				selection = document.querySelector('video');
				break;
			case 'audio':
				selection = document.querySelector('audio');
				break;
			default:
				break;
		}
		return selection;
	}

	function pause() {
		if (object.paused === false) {
			poll.end();
			object.pause();
			notify.push('Paused', 'paused');
		}
	}

	function play(timecode) {
		poll.end();
		notify.dismiss();
		// check if a timecode has been specified, and if it is within range
		if (timecode && timecode > 0 && timecode < object.duration) {
			object.currentTime = timecode;
		}
		object.play();
		poll.run(object);

		// everytime the timecode changes, the following series of actions are taken:
		//  - check to see if any subtitle needs displaying
		//  - check to see if a scene event needs to be fired
		//  - update progress bar
		object.ontimeupdate = function () {
			// I begin my watch...
			subtitles.check(object.currentTime);
			//gui.updateProgressBar();
		};
	}

	function listen(callback) {
		// add an event listener

		object.addEventListener('timeupdate', function () {
			callback(object.currentTime);
		});
	}

	function create(container, media, callback) {
		// --
		// Creates a media object and posts to DOM
		// --

		let Audio = function () {
			// TODO

			return;
		};

		let Graphic = function () {

		};

		let Video = function () {
			// --
			// Create video element for screen
			// --

			let element = document.createElement('video'),
				child1 = document.createElement('source'),
				child2 = document.createElement('source'),
				dimensions = calcVideoSize(media.video.width, media.video.height, view.resolution.width, view.resolution.height);

			element.setAttribute('width', dimensions.width);
			element.setAttribute('height', dimensions.height);
			element.setAttribute('id', config.applicationID + '_video');

			console.log(dimensions);

			if (typeof media.video.ogg === 'string') {
				child1.setAttribute('src', media.video.ogg);
				child1.setAttribute('type', 'video/ogg');
				element.appendChild(child1);
			}

			if (typeof media.video.mp4 === 'string') {
				child2.setAttribute('src', media.video.mp4);
				child2.setAttribute('type', 'video/mp4');
				element.appendChild(child2);
			}

			if (media.video.poster !== null) {
				element.setAttribute('poster', media.video.poster);
			}

			element.loomSE_parameters = {};

			if (media.video.muted === true) {
				element.muted = true;
			}

			// overrides any previous settings
			if (config.behaviour.developer.mute === true) {
				element.muted = true;
			}

			if (media.video.controls === true) {
				element.controls = true;
			}

			if (media.video.autoplay === true) {
				element.loomSE_parameters.autoplay = true;
			}

			if (media.video.loop === true) {
				element.loomSE_parameters.loop = true;

				// check if loop in is a number, if it isn't set in point to 0 by default
				if (typeof media.video.loop_in === 'number') {
					element.loomSE_parameters.loopIn = media.video.loop_in;
				} else {
					element.loomSE_parameters.loopIn = 0;
				}

				// check if loop out is a number, if it isn't, default to null
				if (typeof media.video.loop_out === 'number') {
					element.loomSE_parameters.loopOut = media.video.loop_out;
				} else {
					element.loomSE_parameters.loopOut = null;
				}
			}

			return element;
		};

		view.containers.mediaGroup.appendChild(container);

		if (!callback) {
			throw 'Expected callback';
		}
		if (media.type === 'audio') {
			//callback(audio());
		} else if (media.type === 'video') {
			object = new Video();
			container.appendChild(object);
			//view.scaleVideo(media.video.width, media.video.height, config.behaviour.media.scaleVideoTo);
			callback(object);
		} else if (media.type === 'graphic') {
			//callback(graphic());
		} else {
			throw 'Invalid media type';
		}
	}

	function getLength() {
		if (object.tagName === 'VIDEO' || object.tagName === 'AUDIO') {
			return object.duration;
		}
		return 0;
	}

	function getCurrentTime() {
		if (object.tagName === 'VIDEO' || object.tagName === 'AUDIO') {
			return object.currentTime;
		}
		return 0;
	}

	function calcVideoSize(nativeWidth, nativeHeight, hostWidth, hostHeight) {

		let ratio;

		// first see if we need to scale down or up, depending on the size of video
		// and host device properties

		if (nativeWidth <= hostWidth && nativeHeight <= hostHeight) {
			// scale up

			// first find out if the video should be scaled up from the
			// width or the height
			if (hostWidth / nativeWidth > hostHeight / nativeHeight) {
				ratio = hostHeight / nativeHeight;
			} else {
				ratio = hostWidth / nativeWidth;
			}
		} else {
			// scale down
			if (nativeWidth / hostWidth > nativeHeight / hostHeight) {
				ratio = nativeHeight / hostHeight;
			} else {
				ratio = nativeWidth / hostWidth;
			}
		}

		return {
			height: ratio * nativeHeight,
			width : ratio * nativeWidth
		};
	}

	return {
		object        : object,
		target        : target,
		pause         : pause,
		play          : play,
		listen        : listen,
		create        : create,
		getLength     : getLength,
		getCurrentTime: getCurrentTime
	};
}());
