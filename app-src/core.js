//
// Loom Story Engine
//

import { config } from './config';
import { default as css } from './css';
import { default as environment } from './environment';
import { default as helper } from './helpers';
import { default as media } from './media';
import { default as subtitles } from './subtitles';

const loomSE = (function () {

	// Variables used by the entire app-src
	let _script,
		_currentScene,
		_modules;

	// Generates and handles the graphical user interface for our media player
	let gui = (function () {

		let id = 'gui',
			container = helper.newDOMobject(undefined, 'div', id),
			shadow = helper.newDOMobject(container, 'div', 'gui_shadow'),
			btnGroup = helper.newDOMobject(container, 'div', 'btnGroup'),
			timeGroup = helper.newDOMobject(container, 'div', 'timeGroup'),

			btnGroupLeft = helper.newDOMobject(btnGroup, 'div', 'btnGroupLeft'),
			btnGroupRight = helper.newDOMobject(btnGroup, 'div', 'btnGroupRight'),
			timeElapsed = helper.newDOMobject(timeGroup, 'div', 'time_elapsed'),
			timeDuration = helper.newDOMobject(timeGroup, 'div', 'time_duration'),
			timeSlider = helper.newDOMobject(timeGroup, 'div', 'time_timeSlider'),

			btnPlayPause = new GuiComponent('div', 'btn_playPause', 'btn_sprite', ['pause', 'play']),
			btnRewind = new GuiComponent('div', 'btn_rewind', 'btn_sprite'),
			btnFForward = new GuiComponent('div', 'btn_fforward', 'btn_sprite'),
			btnSkip = new GuiComponent('div', 'btn_skip', 'btn_sprite'),
			btnVolume = new GuiComponent('div', 'btn_volume', 'btn_sprite', ['high', 'off', 'medium']),
			btnSubtitles = new GuiComponent('div', 'btn_subtitles', 'btn_sprite', ['on', 'off']),
			btnShare = new GuiComponent('div', 'btn_share', 'btn_sprite'),
			btnFullscreen = new GuiComponent('div', 'btn_fullscreen', 'btn_sprite'),

			scale; // gui scale - 1 small, 2 medium, 3 large

		function appendButtonComponents() {

			btnGroupLeft.appendChild(btnPlayPause.element);
			btnGroupLeft.appendChild(btnRewind.element);
			btnGroupLeft.appendChild(btnFForward.element);
			btnGroupLeft.appendChild(btnSkip.element);

			btnGroupRight.appendChild(btnVolume.element);
			btnGroupRight.appendChild(btnSubtitles.element);
			btnGroupRight.appendChild(btnShare.element);
			btnGroupRight.appendChild(btnFullscreen.element);
		}

		function GuiComponent(type, id, cssClass, states, mouseOver, mouseOut) {
			this.element = helper.newElement(type, id, cssClass);

			this.element.loomSE = {};

			if (mouseOver) {
				this.element.mouseOverEvent = function () {
					mouseOver.call(this);
				};
			}

			if (mouseOut) {
				this.element.mouseOutEvent = function () {
					mouseOut.call(this);
				};
			}

			// states
			if (states) {
				this.element.states = states;
				this.element.currentStateIndex = 0;
				this.element.currentState = states[0];

				this.element.changeState = function () {
					// cycle through states
					let states = this.states,
						currentStateIndex = this.currentStateIndex;

					if (currentStateIndex === states.length - 1) {
						this.currentStateIndex = 0;
					} else {
						this.currentStateIndex += 1;
					}
					this.currentState = states[this.currentStateIndex];
				};
			}
		}

		btnPlayPause.element.clickEvent = function () {

			if (this.currentState === 'play') {
				media.pause();
				this.classList.add('btn_play');
				this.classList.remove('btn_pause');
			}
			if (this.currentState === 'pause') {
				media.play();
				this.classList.remove('btn_play');
				this.classList.add('btn_pause');
			}

			this.changeState();
		};

		btnRewind.element.clickEvent = function () {
			media.play(0.1);
			subtitles.reset(0);
		};

		btnFForward.element.clickEvent = function () {
			if (media.object.paused === false) {
				let time = media.getCurrentTime() + config.behaviour.media.fastForwardSkip;

				if (time < media.getLength()) {
					media.play(time);
					subtitles.reset(time);
				}
			}
		};

		btnVolume.element.clickEvent = function () {

			if (this.currentState === 'high') {
				this.classList.remove('btn_vol_high');
				this.classList.remove('btn_vol_med');
				this.classList.add('btn_vol_off');
			}
			if (this.currentState === 'medium') {
				this.classList.remove('btn_vol_med');
				this.classList.remove('btn_vol_off');
				this.classList.add('btn_vol_high');
			}
			if (this.currentState === 'off') {
				this.classList.remove('btn_vol_high');
				this.classList.remove('btn_vol_off');
				this.classList.add('btn_vol_med');
			}

			this.changeState();
		};

		btnSubtitles.element.clickEvent = function () {

			if (this.currentState === 'on') {
				subtitles.off();
				this.classList.remove('btn_sub_on');
				this.classList.add('btn_sub_off');
			}
			if (this.currentState === 'off') {
				subtitles.on();
				this.classList.remove('btn_sub_off');
				this.classList.add('btn_sub_on');
			}

			this.changeState();
		};

		function updateProgressBar() {
			let getDuration = media.getLength(),
				getCurrentTime = media.getCurrentTime(),
				duration = helper.clock(getDuration),
				currentTime = helper.clock(getCurrentTime),
				maxWidth = container.offsetWidth,
				progressWidth = getCurrentTime / getDuration * maxWidth;

			function formatTime(object) {
				let timeContainer = document.createElement('div'),
					timeHours = helper.newElement('span', undefined, 'hour'),
					timeMinutes = helper.newElement('span', undefined, 'minute'),
					timeSeconds = helper.newElement('span', undefined, 'second'),
					dividerHours = document.createElement('span'),
					dividerMinutes = document.createElement('span');

				dividerHours.innerHTML = ':';
				dividerMinutes.innerHTML = ':';

				timeHours.innerHTML = object.hours;
				timeContainer.appendChild(timeHours);
				timeContainer.appendChild(dividerHours);

				timeMinutes.innerHTML = object.minutes;
				timeContainer.appendChild(timeMinutes);
				timeContainer.appendChild(dividerMinutes);

				timeSeconds.innerHTML = object.seconds;
				timeContainer.appendChild(timeSeconds);

				return timeContainer;
			}

			while (timeElapsed.firstChild) {
				timeElapsed.removeChild(timeElapsed.firstChild);
			}
			while (timeDuration.firstChild) {
				timeDuration.removeChild(timeDuration.firstChild);
			}

			timeElapsed.appendChild(formatTime(currentTime));
			timeDuration.appendChild(formatTime(duration));

			css.style(timeSlider, {
				width: progressWidth
			});
		}

		function load() {
			appendButtonComponents();
			updateProgressBar();
			environment.containers.root.appendChild(container);
		}

		function unload() {
			environment.containers.root.removeChild(container);
		}

		function listenForEvents() {

			function listenToChildren(array) {
				if (typeof array.length === 'number') {
					for (let i = 0; i < array.length; i += 1) {

						let currentChild = array[i];

						if (currentChild.mouseOverEvent) {

							// hover events
							currentChild.addEventListener('mouseover', function () {
								this.mouseOverEvent();
							});

							array[i].addEventListener('mouseout', function () {
								this.mouseOutEvent();
							});
						}

						if (currentChild.clickEvent) {
							currentChild.addEventListener('click', function () {

								this.clickEvent();
							});
						}
					}
				}
			}

			// listen to children for clicks and hover

			listenToChildren(btnGroupLeft.children);
			listenToChildren(btnGroupRight.children);
		}

		return {
			load: function () {
				load();
				listenForEvents();
			},

			unload: function () {
				unload();
			},

			updateProgressBar: updateProgressBar
		};
	}());

	// Handles the fullscreen API
	let fullScreen = (function () {

		let state;

		function toggle() {
			console.log('Not implemented yet');
		}

		return {
			toggle: toggle,
			state : state
		};
	}());

	// Keeps a record of the scenes passed through by the user and provides some control over how to navigate the history
	let history = (function () {
		let scenes = [];
		return {
			record: function (object) {
				// records scene
				scenes.push(object);
			},

			erase: function () {
				// removes scene

			},

			remind: function () {
				// returns current scene
				return scenes[scenes.length - 1];
			},

			rewind: function () {
				// goes back 1 scene & erases current scene
				let scene;
				if (scenes.length > 1) {
					scenes.splice(scenes.length - 1, 1);
				}
				scene = scenes[scenes.length - 1];
				return scene;
			},

			saveToLocalStorage: function () {
				// save to html5 local storage
			}
		};
	}());

	// Handles the script logic
	let readScript = (function () {

		// --
		// A collection of methods that set process the media elements in the Script
		// --

		// Constructor function that creates instances of each scene
		let Scene = function (title, language, assets) {
			let that = this;
			this.title = title;
			this.shortName = assets.short_name;
			this.longName = assets.long_name;
			this.sceneId = helper.cleanString(this.title);
			this.media = assets.media;
			this.subtitles = assets.media.subtitles[language];
			this.events = assets.events;
			this.container = (function () {
				let element = document.createElement('div');
				element.setAttribute('id', that.sceneId);
				element.media = that.media.type;
				return element;
			}());
		};

		function process(scene) {
			// --
			// Processes the current scene
			// --
			// Each scene is composed of a 'media' type, which in turn has 'data' and 'parameters'
			// Each 'media' type also has a number of events

			media.create(scene.container, scene.media, function (playObject) {

				media.object = playObject;
				// check which media needs to play
				// play video
				if (scene.media.type === 'video') { // TODO need to allow this to accept and process multiple strings
					//scene.media.video.duration = playObject.duration;

					// check if video SHOULD autoplay
					if (media.object.loomSE_parameters.autoplay === true) {
						media.play();
						// environment.resolution.video.height = media.object.videoHeight;
						// environment.resolution.video.height = media.object.videoWidth;
					}

					//if(playObject.loop === false && (scene.data.nextSceneByDefault !== null || scene.data.nextnextSceneByDefault !== '')){
					//    playObject.onended = function(e){
					//        readScript.setScene(scene.data.nextSceneByDefault);
					//    };
					//}

					// video loop logic must stay here

					if (media.object.loomSE_parameters.loop === true) {
						if (media.object.loomSE_parameters.loopIn === 0 && media.object.loomSE_parameters.loopOut === null) {
							media.object.onended = function (e) {
								console.log('Looping from end to beginning');
								environment.reset();
								events.reset();
								media.play(0);
							};
						} else {
							console.log('Im going to loop the video from the in and out points defined');
							// add loop point as event
							// for the purposes of our system, in / out points are reversed
							// (schedule in point is actually loop out point etc)
							_currentScene.events.push(
								{
									call: 'loop',
									schedule: {
										in: media.object.loomSE_parameters.loopOut,
										out: media.object.loomSE_parameters.loopIn
									}
								}
							);
						}
					}
				}

				if (scene.events !== null) {
					events.schedule(media.object, scene.events, function () {
					});
				} else {
					helper.report('[Events] No events in scene.');
				}
			});
		}

		function setScene(scriptObject, scene) {
			// --
			// Runs when a new scene is set from the Script
			// Pulls the relevant scene details from the object, resets parameters and launches the process() method.
			// --

			_currentScene = new Scene(scene, config.behaviour.settings.language, scriptObject.scenes[scene]);

			//check if subtitles should be on
			if (config.behaviour.settings.subtitles === true) {
				subtitles.on();
			} else {
				subtitles.off();
			}
			subtitles.parse(_currentScene.subtitles);

			history.record(_currentScene);
			process(_currentScene);
		}

		return {
			setScene: setScene
		};
	}());

	// Handles all the logic for the scene events, for example we handle the schedule for each event here
	let events = (function () {
		let eventQueue = [];

		// Constructor function that creates instances of each event
		let Event = function (id, call, ignored, schedule, parameters) {

			//check if the module reference exists as a function
			if (typeof _modules[call] === 'function') {
				let callModule = _modules[call]();
			}

			if (ignored === true) {
				this.state = 'ignored';
			} else {
				this.state = 'waiting';
			}

			this.id = id; // event id
			this.call = call;
			this.state = 'waiting'; // waiting, fired, expired
			this.in = schedule.in / 1000;
			this.out = schedule.out / 1000;
			this.parameters = parameters;
			this.class = parameters.class;
			this.container = helper.newElement('div', id, this.class);
			this.container.loomSE = {
				resolution: {
					width: environment.resolution.width,
					height: environment.resolution.height
				},
				parameters: this.parameters,
				schedule: {
					in: this.in,
					out: this.out
				}
			};
			this.container.loomSE.parameters.id = this.id;
			if (typeof this.parameters.x === 'number' && typeof this.parameters.y === 'number') {
				this.container.loomSE.position = function () {

					// using a co-ordinate system of %, place objects on screen
					let translatedCoords = {
							x: this.resolution.width / 100 * this.parameters.x,
							y: this.resolution.height / 100 * this.parameters.y
						},
						thisObject = document.getElementById('loomSE_' + this.parameters.id);
					thisObject.setAttribute('style', 'position: absolute; left: ' + translatedCoords.x + 'px; ' + 'top: ' + translatedCoords.y + 'px');
				};
			}
			// runs at beginning of event (in time)
			this.run = function () {
				if (this.state === 'waiting') {
					this.state = 'fired';
					environment.containers.events.appendChild(this.container);
					callModule.run(this.container, {in: this.in, out: this.out}, this.parameters);
				}
			};
			// runs when the event has expired (out time)
			this.stop = function () {
				if (this.state === 'fired') {
					this.state = 'expired';
					environment.containers.events.removeChild(this.container);
				}
			};
			this.kill = function (callback) {
				if (this.container.firstChild) {
					this.container.removeChild(this.container.firstChild);
				} else {
					callback();
				}
			};
		};

		function schedule(target, array, callback) {
			// --
			// Schedules timed events for each media element
			// --

			for (let i = 0; i < array.length; i += 1) {
				let event = array[i],
					id = event.call + '_' + i;

				eventQueue[i] = new Event(id, event.call, event.ignored, event.schedule, event.parameters);

				Event.prototype.schedule = function () {

					// We calculate the ins and outs here
					let that = this,
						timeIn = that.in,
						timeOut = that.out,
						timeInLow = timeIn - config.behaviour.media.timeEventResolution / 2,
						timeInHigh = timeIn + config.behaviour.media.timeEventResolution / 2,
						timeOutLow = timeOut - config.behaviour.media.timeEventResolution / 2,
						timeOutHigh = timeOut + config.behaviour.media.timeEventResolution / 2;

					media.listen(function (time) {
						if (time >= timeInLow && time <= timeInHigh) {
							if (config.behaviour.developer.verbose === 'full') {
								helper.report('[Event] Run: ' + id);
								helper.report('[Event] ' + 'T:' + time + ', L:' + timeInLow + ', H:' + timeInHigh);
							}

							that.run();
						}
						// 'Out'
						if (time >= timeOutLow && time <= timeOutHigh) {
							if (config.behaviour.developer.verbose === 'full') {
								helper.report('[Event] Stop: ' + id);
								helper.report('[Event] ' + 'T:' + time + ', L:' + timeOutLow + ', H:' + timeOutHigh);
							}

							that.stop();
						}
					});
				};


				eventQueue[i].schedule();
			}

			callback();
		}

		function reset() {
			for (let i = 0; i < eventQueue.length; i += 1) {
				eventQueue[i].state = 'waiting';
			}
		}

		function show() {
			console.log(eventQueue);
		}

		function killAll(callback) {
			for (let i = 0; i < eventQueue.length; i += 1) {
				eventQueue[i].kill(callback);
			}
		}

		return {
			schedule: schedule,
			reset: reset,
			killAll: killAll
		};
	}());

	//
	// the public interface
	//

	let publicInterface = {
		// namespace for our external modules
		Modules: function () {
		},

		pause: function () {
			media.pause();
			return 'Paused';
		},

		play: function () {
			media.play();
			return 'Playing';
		},

		seek: function (time) {
			// scrub to time in media
			// time in seconds 4 = 4 seconds
			media.seek(time);
			return 'Seeking';
		},

		reload: function () {
			// restarts the current scene

			return 'Reloaded scene';
		},

		skip: function (sceneName) {
			// abandon current scene and load the named scene

			return 'Skipped to scene' + sceneName;
		},

		viewportResize: function () {

		},

		fullScreen: fullScreen.toggle,

		status: function () {
			// report stats on media
			console.log(config);
			console.log('Current time:' + media.getCurrentTime() + ' / Duration: ' + media.getLength());
		},

		currentTime: {
			seconds: function () {
				return media.getCurrentTime();
			},

			object: function () {
				return helper.clock(media.getCurrentTime());
			}
		},

		duration: {
			seconds: function () {
				return media.getLength();
			},

			object: function () {
				return helper.clock(media.getLength());
			}
		}
	};

	/**
	 * Our public initialise method, used to initialise our application
	 * @param {Function} callback - callback to run after script processing
	 *
	 */
	publicInterface.initialise = function (callback) {

		console.log('ready');

		// load script file and check the returned data

		helper.ajaxRequest(config.scriptFile, 'JSON', true, function (returnedData) {
			_script = returnedData;

			if (typeof returnedData === 'object') {
				// set up the environment
				environment.initialise(config.target, config.resolution);
				_modules = new loomSE.Modules();
				readScript.setScene(_script, config.firstScene);
				gui.load();

				if (callback) {
					callback();
				}
			} else {
				helper.report('Script file not found');
			}
		});
	};
	// return just the public parts
	return publicInterface;
}());

///

loomSE.initialise();