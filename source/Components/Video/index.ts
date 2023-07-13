import { el, mount } from 'redom';

import Source from './Source';
import { radioService } from '../../services/radioService';
import { RadioChannel } from '../../types/radioChannels';
import styles from './styles';

class VideoError extends Error {}

interface VideoProps {
	controls?: boolean;
	loop?: { in: number; out: number } | boolean;
	muted?: boolean;
	sources: { [key: string]: string };
}

export default class Video {
	public el: HTMLVideoElement;
	public broadcastEndedEvent: () => void;
	public broadcastDurationChangeEvent: () => void;
	public broadcastPlayingEvent: () => void;
	public broadcastPausedEvent: () => void;
	public broadcastSeekedEvent: () => void;
	public broadcastSeekingEvent: () => void;
	public broadcastTimeUpdateEvent: () => void;
	public tokenPause: string;
	public tokenPlay: string;
	public sources: { [key: string]: Source };

	constructor({
		controls = false,
		loop = false,
		muted = false,
		sources
	}: VideoProps) {
		this.el = el('video', {
			autoplay: false,
			controls: controls,
			loop: loop,
			muted: muted,
			style: { ...styles }
		});

		this.sources = this.setSources(sources);
		this.mountSources();

		this.broadcastEndedEvent = () =>
			radioService.broadcastOnChannel(RadioChannel.VIDEO_ENDED);
		this.broadcastDurationChangeEvent = () =>
			radioService.broadcastOnChannel(
				RadioChannel.VIDEO_DURATION_CHANGED,
				this.el.duration
			);
		this.broadcastPlayingEvent = () =>
			radioService.broadcastOnChannel(
				RadioChannel.VIDEO_PLAYING,
				this.el.currentTime
			);
		this.broadcastPausedEvent = () =>
			radioService.broadcastOnChannel(RadioChannel.VIDEO_PAUSED);
		this.broadcastSeekedEvent = () =>
			radioService.broadcastOnChannel(
				RadioChannel.VIDEO_SEEKED,
				this.el.currentTime
			);
		this.broadcastSeekingEvent = () =>
			radioService.broadcastOnChannel(
				RadioChannel.VIDEO_SEEKING,
				this.el.currentTime
			);
		this.broadcastTimeUpdateEvent = () =>
			radioService.broadcastOnChannel(
				RadioChannel.VIDEO_TIMEUPDATE,
				this.el.currentTime
			);

		this.tokenPause = radioService.listenToChannel(
			RadioChannel.DIRECTOR_PAUSE,
			this.pause,
			this
		);
		this.tokenPlay = radioService.listenToChannel(
			RadioChannel.DIRECTOR_PLAY,
			this.play,
			this
		);

		this.listenToVideoEvents();
	}

	onunmount() {
		this.stopListeningToVideoEvents();
		this.stopListeningToRadio();
	}

	setSources(sources: { [key: string]: string }) {
		if (!sources) {
			throw new VideoError('No video sources found');
		}

		const generatedSources: { [key: string]: Source } = {};

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
		radioService.stopListening(this.tokenPause);
		radioService.stopListening(this.tokenPlay);
	}

	play() {
		this.el.play().catch((error) => {
			console.warn(error);
		});
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
