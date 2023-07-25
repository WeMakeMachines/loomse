import { el, mount, unmount } from 'redom';

import { StopListeningFunction } from '../../services/radioService/listeners';

import {
	broadcastVideoDurationChanged,
	broadcastVideoEnded,
	broadcastVideoPaused,
	broadcastVideoPlaying,
	broadcastVideoSeeked,
	broadcastVideoSeeking,
	broadcastVideoTimeUpdate
} from '../../services/radioService/broadcasters';
import {
	listenToDirectorPause,
	listenToDirectorPlay
} from '../../services/radioService/listeners';
import Source from './Source';
import Subtitles from '../Subtitles';
import { container } from 'tsyringe';
import SubtitleEventService from '../../services/subtitleEventService';

class VideoError extends Error {}

interface VideoProps {
	controls?: boolean;
	loop?: { in: number; out: number } | boolean;
	muted?: boolean;
	sources: { [key: string]: string };
	subtitles?: string;
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
	public stopListeningToVideoPause: StopListeningFunction;
	public stopListeningToVideoPlay: StopListeningFunction;
	public sources: { [key: string]: Source };

	constructor({
		controls = false,
		loop = false,
		muted = false,
		sources,
		subtitles
	}: VideoProps) {
		this.el = el('video', {
			autoplay: false,
			controls: controls,
			loop: loop,
			muted: muted
		});
		this.el.className = 'loomse__video';

		this.sources = this.setSources(sources);
		this.mountSources();

		if (subtitles) {
			new Subtitles(container.resolve(SubtitleEventService), subtitles);
		}

		this.broadcastEndedEvent = () => broadcastVideoEnded();

		this.broadcastDurationChangeEvent = () =>
			broadcastVideoDurationChanged(this.el.duration);

		this.broadcastPlayingEvent = () =>
			broadcastVideoPlaying(this.el.currentTime);

		this.broadcastPausedEvent = () => broadcastVideoPaused();

		this.broadcastSeekedEvent = () =>
			broadcastVideoSeeked(this.el.currentTime);

		this.broadcastSeekingEvent = () =>
			broadcastVideoSeeking(this.el.currentTime);

		this.broadcastTimeUpdateEvent = () =>
			broadcastVideoTimeUpdate(this.el.currentTime);

		this.stopListeningToVideoPause = listenToDirectorPause(() =>
			this.pause()
		);

		this.stopListeningToVideoPlay = listenToDirectorPlay(() => this.play());

		this.listenToVideoEvents();
	}

	onunmount() {
		this.stopListeningToVideoEvents();
		this.stopListeningToRadio();
		this.unmountSources();
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

			try {
				generatedSources[key] = new Source(key, sources[key]);
			} catch (error) {
				console.warn(`${error}, skipping...`);
			}
		}

		return generatedSources;
	}

	manageSources(callback: (source: Source) => void) {
		for (const key in this.sources) {
			if (!this.sources.hasOwnProperty(key)) {
				continue;
			}

			const source = this.sources[key];

			callback(source);
		}
	}

	mountSources() {
		this.manageSources((source) => mount(this.el, source.el));
	}

	unmountSources() {
		this.manageSources((source) => unmount(this.el, source.el));
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
		this.stopListeningToVideoPause();
		this.stopListeningToVideoPlay();
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
