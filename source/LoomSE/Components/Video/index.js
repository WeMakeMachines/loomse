import { el, mount } from 'redom';

import Source from './Source';

import { radioService } from '../../services';

import {
	DIRECTOR_PLAY,
	DIRECTOR_PAUSE
} from '../../constants/applicationActions';

import {
	VIDEO_ENDED,
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
		autoplay = false,
		controls = false,
		loop = false,
		muted = false,
		sources = {}
	}) {
		this.node = el('video#loomSE_video', {
			autoplay: false,
			controls: controls,
			loop: loop,
			muted: muted,
			style: { ...styles.video }
		});

		this.sources = this.setSources(sources);
		this.mountSources();
		this.listenToVideoEvents();

		this.pauseToken = radioService.register(
			DIRECTOR_PAUSE,
			this.pause,
			this
		);
		this.playToken = radioService.register(DIRECTOR_PLAY, this.play, this);

		if (autoplay) {
			this.play();
		}
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

			mount(this.node, source.node);
		}
	}

	listenToVideoEvents() {
		this.node.addEventListener('playing', () => {
			radioService.broadcast(VIDEO_PLAYING, {
				time: this.node.currentTime
			});
		});

		this.node.addEventListener('paused', () => {
			radioService.broadcast(VIDEO_PAUSED, {
				time: this.node.currentTime
			});
		});

		this.node.addEventListener('seeking', () => {
			radioService.broadcast(VIDEO_SEEKING, {
				time: this.node.currentTime
			});
		});

		this.node.addEventListener('seeked', () => {
			radioService.broadcast(VIDEO_SEEKED, {
				time: this.node.currentTime
			});
		});

		this.node.addEventListener('timeupdate', () => {
			radioService.broadcast(VIDEO_TIMEUPDATE, {
				time: this.node.currentTime
			});
		});

		this.node.addEventListener('ended', () => {
			radioService.broadcast(VIDEO_ENDED, {
				time: this.node.currentTime
			});
		});
	}

	stopListeningToRadio() {
		radioService.unRegister(this.pauseToken);
		radioService.unRegister(this.playToken);
	}

	play() {
		this.node
			.play()
			.then(() => {
				// this.resize({
				// 	width: state.clientDimensions.width,
				// 	height: state.clientDimensions.height
				// });
			})
			.catch(() => {});
	}

	pause() {
		this.node.pause();
	}

	playPause() {
		if (this.node.paused) {
			this.play();
		} else {
			this.pause();
		}
	}
}

export default Video;
