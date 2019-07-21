import Component from '../Abstract';

import Source from './Source';

import { radio } from '../../../services';

import {
	DIRECTOR_PLAY,
	DIRECTOR_PAUSE
} from '../../../constants/applicationActions';

import state from '../../state';

import styles from './styles';

class VideoError extends Error {}

export class Video extends Component {
	constructor(options) {
		super({
			type: 'video',
			styles: styles.video
		});

		this.node.autoplay = false;
		this.node.controls = options.controls;
		this.node.loop = options.loop;
		this.node.muted = options.muted || false;

		this.play = () => {
			this.node
				.play()
				.then(() => {
					this.resize({
						width: state.clientDimensions.width,
						height: state.clientDimensions.height
					});
				})
				.catch(() => {});
		};

		this.pause = () => {
			this.node.pause();
		};

		this.sources = this.setSources(options.sources);
		this.mountSources();
		this.registerMediaEvents();
		this.listenToRadio();

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

			source.mount({ node: this.node });
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
				radio.broadcast(`video:${event}`, {
					state: event,
					time: this.node.currentTime
				});
			});
		});
	}

	listenToRadio() {
		radio.listen(DIRECTOR_PAUSE, this.pause);
		radio.listen(DIRECTOR_PLAY, this.play);
	}

	stopListeningToRadio() {
		radio.stopListening(DIRECTOR_PAUSE, this.pause);
		radio.stopListening(DIRECTOR_PLAY, this.play);
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
