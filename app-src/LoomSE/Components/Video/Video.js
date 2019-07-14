import Component from '../Abstract';

import { radio } from '../../../services';

import {
	DIRECTOR_PLAY,
	DIRECTOR_PAUSE
} from '../../../constants/applicationActions';

import state from '../../state';

import styles from './styles';

export class Video extends Component {
	static setSources(options) {
		const sources = {};

		if (options.mp4 && typeof options.mp4 === 'string') {
			sources.mp4 = new Component({ type: 'source' });
			sources.mp4.setAttributes({
				src: options.mp4,
				type: 'video/mp4'
			});
		}

		if (options.ogg && typeof options.ogg === 'string') {
			sources.ogg = new Component({ type: 'source' });
			sources.ogg.setAttributes({
				src: options.ogg,
				type: 'video/ogg'
			});
		}

		return sources;
	}

	constructor(options) {
		super({
			type: 'video',
			styles: styles.video
		});

		this.node.autoplay = false;
		this.node.controls = options.controls;
		this.node.loop = options.loop;
		this.node.muted = options.muted || false;

		this.sources = this.constructor.setSources({
			mp4: options.mp4,
			ogg: options.ogg
		});

		this.mountSources();
		this.registerMediaEvents();
		this.listenToRadio();

		if (options.autoplay) {
			this.play();
		}
	}

	mountSources() {
		for (let key in this.sources) {
			if (!this.sources.hasOwnProperty(key)) {
				continue;
			}

			const source = this.sources[key];

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
		radio.listen(DIRECTOR_PAUSE, () => this.pause());
		radio.listen(DIRECTOR_PLAY, () => this.play());
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
