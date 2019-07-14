import Component from '../Abstract';

import { Queue } from '../../Models';

import { Block } from '../';

import { RUN, STOP } from '../../../constants/eventActions';

import { secondsToMilliseconds, parseFile } from '../../tools';

import { radio } from '../../../services';

import storyBehaviour from '../../../constants/storyBehaviour';

import styles from './styles';

import state from '../../state';

export class Subtitles extends Component {
	constructor(url) {
		super({
			id: 'subtitles',
			styles: styles.subtitles
		});

		this.parsedFile = parseFile(url[state.language]);
		this.active = false;
		this.activeEvents = {};

		this.parsedFile.then(subtitles => {
			this.queue = new Queue(subtitles);

			this.listenToRadio();
		});

		this.parsedFile.catch(error => {
			console.warn(error);
		});
	}

	isReadyToAction(time) {
		if (!time || !this.queue.pending) {
			return;
		}

		if (time >= this.queue.pending.time) {
			this.runAction(this.queue.pending);
		}
	}

	runAction(event) {
		switch (event.action) {
			case RUN:
				this.showSubtitle(event);
				break;
			case STOP:
				this.hideSubtitle(event);
				break;
			default:
				return;
		}

		this.queue.advance();
	}

	showSubtitle(event) {
		const timedObject = this.queue.getTimedObject(event.id);

		this.activeEvents[event.id] = new Block({
			type: 'p',
			id: `subtitle-${event.id}`,
			styles: styles.subtitle,
			x: storyBehaviour.subtitles.x,
			y: storyBehaviour.subtitles.y,
			text: timedObject.payload.text,
			parent: this.node
		});

		this.activeEvents[event.id].render();
	}

	hideSubtitle(event) {
		this.activeEvents[event.id].unmount();

		delete this.activeEvents[event.id];
	}

	listenToRadio() {
		radio.listen('video:timeupdate', payload => {
			if (payload.time) {
				const time = secondsToMilliseconds(payload.time);

				this.isReadyToAction(time);
			}
		});
	}
}
