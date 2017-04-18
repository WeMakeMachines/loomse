// Generates and handles the graphical user interface for our media player

import { clock, newObject } from './tools/common';
import css from './css';
import environment from './view/controller';
import media from './media';
import subtitles from './subtitles';

export default (function () {

	let id = 'gui',
		container = newObject('div', { id: id }),
		shadow = newObject('div', { id: 'gui_shadow', parent: container }),
		btnGroup = newObject('div', { id: 'btnGroup', parent: container }),
		timeGroup = newObject('div', { id: 'timeGroup', parent: container }),

		btnGroupLeft = newObject('div', { id: 'btnGroupLeft', parent: btnGroup}),
		btnGroupRight = newObject('div', { id: 'btnGroupRight', parent: btnGroup }),
		timeElapsed = newObject('div', { id: 'time_elapsed', parent: timeGroup }),
		timeDuration = newObject('div', { id: 'time_duration', parent: timeGroup }),
		timeSlider = newObject('div', { id: 'time_timeSlider', parent: timeGroup }),

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
		this.element = newObject(type, { id: id, class: cssClass });

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
			duration = clock(getDuration),
			currentTime = clock(getCurrentTime),
			maxWidth = container.offsetWidth,
			progressWidth = getCurrentTime / getDuration * maxWidth;

		function formatTime(object) {
			let timeContainer = document.createElement('div'),
				timeHours = newObject('span', { class: 'hour' }),
				timeMinutes = newObject('span', { class: 'minute' }),
				timeSeconds = newObject('span', { class: 'second' }),
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

						// hover events.js
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