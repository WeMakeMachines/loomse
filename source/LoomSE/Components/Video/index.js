import { el, mount } from 'redom';

import Source from './Source';

import { radioService } from '../../services';

import { DIRECTOR_PLAY, DIRECTOR_PAUSE } from '../../constants/directorEvents';

import {
	VIDEO_ENDED,
	VIDEO_DURATION_CHANGED,
	VIDEO_PAUSED,
	VIDEO_PLAYING,
	VIDEO_SEEKED,
	VIDEO_SEEKING,
	VIDEO_TIMEUPDATE
} from '../../constants/videoEvents';

import styles from './styles';

class VideoError extends Error {}

class Video {
	constructor({
		controls = false,
		loop = false,
		muted = false,
		sources = {}
	}) {
		this.el = el('video', {
			autoplay: false,
			controls: controls,
			loop: loop,
			muted: muted,
			style: { ...styles }
		});

		this.sources = this.setSources(sources);
		this.mountSources();

		this.broadcastEndedEvent = () => radioService.broadcast(VIDEO_ENDED);
		this.broadcastDurationChangeEvent = () =>
			radioService.broadcast(VIDEO_DURATION_CHANGED, this.el.duration);
		this.broadcastPlayingEvent = () =>
			radioService.broadcast(VIDEO_PLAYING, this.el.currentTime);
		this.broadcastPausedEvent = () => radioService.broadcast(VIDEO_PAUSED);
		this.broadcastSeekedEvent = () =>
			radioService.broadcast(VIDEO_SEEKED, this.el.currentTime);
		this.broadcastSeekingEvent = () =>
			radioService.broadcast(VIDEO_SEEKING, this.el.currentTime);
		this.broadcastTimeUpdateEvent = () =>
			radioService.broadcast(VIDEO_TIMEUPDATE, this.el.currentTime);

		this.tokenPause = radioService.register(
			DIRECTOR_PAUSE,
			this.pause,
			this
		);
		this.tokenPlay = radioService.register(DIRECTOR_PLAY, this.play, this);

		this.listenToVideoEvents();
	}

	onunmount() {
		this.stopListeningToVideoEvents();
		this.stopListeningToRadio();
	}

	setSources(sources) {
		if (!sources) {
			throw new VideoError('No video sources found');
		}

		const generatedSources = {};

		for (const key in sources) {
			if (!sources.hasOwnProperty(key)) {
				continue;
			}

			generatedSources[key] = new Source(key, sources[key]);
		}

		return generatedSources;
	}

	mountSources() {
		for (const key in this.sources) {
			if (!this.sources.hasOwnProperty(key)) {
				continue;
			}

			const source = this.sources[key];

			mount(this.el, source.el);
		}
	}

	listenToVideoEvents() {
		this.el.addEventListener('ended', this.broadcastEndedEvent);
		this.el.addEventListener(
			'durationchange',
			this.broadcastDurationChangeEvent
		);
		this.el.addEventListener('paused', this.broadcastPausedEvent);
		this.el.addEventListener('playing', this.broadcastPlayingEvent);
		this.el.addEventListener('seeked', this.broadcastSeekedEvent);
		this.el.addEventListener('seeking', this.broadcastSeekingEvent);
		this.el.addEventListener('timeupdate', this.broadcastTimeUpdateEvent);
	}

	stopListeningToVideoEvents() {
		this.el.removeEventListener('ended', this.broadcastEndedEvent);
		this.el.removeEventListener(
			'durationchange',
			this.broadcastDurationChangeEvent
		);
		this.el.removeEventListener('paused', this.broadcastPausedEvent);
		this.el.removeEventListener('playing', this.broadcastPlayingEvent);
		this.el.removeEventListener('seeked', this.broadcastSeekedEvent);
		this.el.removeEventListener('seeking', this.broadcastSeekingEvent);
		this.el.removeEventListener(
			'timeupdate',
			this.broadcastTimeUpdateEvent
		);
	}

	stopListeningToRadio() {
		radioService.unRegister(this.tokenPause);
		radioService.unRegister(this.tokenPlay);
	}

	play() {
		this.el
			.play()
			.then(() => {})
			.catch(() => {});
	}

	pause() {
		this.el.pause();
	}

	playPause() {
		if (this.el.paused) {
			this.play();
		} else {
			this.pause();
		}
	}
}

export default Video;
