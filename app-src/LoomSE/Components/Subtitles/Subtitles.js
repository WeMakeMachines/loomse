import Block from '../Block';
import TimedComponent from '../TimedComponent';

import config from '../../../config';

import styles from './styles';

export class Subtitles extends TimedComponent {
	constructor(subtitles) {
		super('subtitles', styles.subtitles, subtitles);
	}

	run(event) {
		const timedObject = this.queue.getTimedObject(event.id);

		this.activeEvents[event.id] = new Block({
			type: 'p',
			id: `subtitle-${event.id}`,
			styles: styles.subtitle,
			x: config.subtitles.x,
			y: config.subtitles.y,
			text: timedObject.payload.text,
			parent: this.node
		});

		this.activeEvents[event.id].render();
	}

	stop(event) {
		this.activeEvents[event.id].unmount();

		delete this.activeEvents[event.id];
	}
}
