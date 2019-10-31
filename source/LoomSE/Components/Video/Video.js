import Component from '../Abstract';

import Source from './Source';

import { radioService } from '../../lib/radioService';

import {
	DIRECTOR_PLAY,
	DIRECTOR_PAUSE
} from '../../constants/applicationActions';

import state from '../../state';

import styles from './styles';

import appConfig from '../../appConfig';

class VideoError extends Error {}

export class Video extends Component {
	constructor(options, config = appConfig) {
		const videoStyles = {
			...styles.video,
			objectFit: config.videoStretchMethod
		};

		super({
			type: 'video',
			styles: videoStyles
		});

		this.node.autoplay = false;
		this.node.controls = options.controls;
		this.node.loop = options.loop;
		this.node.muted = options.muted || false;

		this.sources = this.setSources(options.sources);
		this.mountSources();
		this.registerMediaEvents();

		this.listenToChannel(DIRECTOR_PAUSE, this.pause);
		this.listenToChannel(DIRECTOR_PLAY, this.play);

		if (options.autoplay) {
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

			const source = this.sources[key].element;

			source.mountTo(this.node);
		}
	}

	registerMediaEvents() {
		let events = [
			'playing',
			'paused',
			'seeking',
			'seeked',
			'timeupdate',
			'ended'
		];

		events.forEach(event => {
			this.node.addEventListener(event, () => {
				radioService.broadcast(`video:${event}`, {
					state: event,
					time: this.node.currentTime
				});
			});
		});
	}

	stopListeningToRadio() {
		this.stopListeningToChannel(DIRECTOR_PAUSE);
		this.stopListeningToChannel(DIRECTOR_PLAY);
	}

	play() {
		this.node
			.play()
			.then(() => {
				this.resize({
					width: state.clientDimensions.width,
					height: state.clientDimensions.height
				});
			})
			.catch(() => {});
	}

	pause() {
		this.node.pause();
	}

	playPause() {
		if (this.node.paused) {
			this.play();
			return true;
		}

		this.pause();

		return false;
	}
}
