import { el } from 'redom';

import ProgressCounter from './ProgressCounter';
import styles from './styles';

import {
	listenToVideoDurationChanged,
	listenToVideoTimeUpdate
} from '../../services/radioService/listenTo';
import { radio } from '../../services/radioService/radio';

export default class Timeline {
	public duration = 999;

	public el: HTMLElement;
	public progressCounter: ProgressCounter;
	public tokenDurationChanged: string;
	public tokenTimeUpdate: string;

	constructor() {
		this.el = el(
			'div',
			{ style: { ...styles } },
			(this.progressCounter = new ProgressCounter())
		);

		this.tokenDurationChanged = listenToVideoDurationChanged((duration) => {
			this.duration = duration;
		});
		this.tokenTimeUpdate = listenToVideoTimeUpdate((time) =>
			this.updateProgress(time)
		);
	}

	onunmount() {
		this.stopListeningToRadio();
	}

	stopListeningToRadio() {
		radio.stopListening(this.tokenDurationChanged);
		radio.stopListening(this.tokenTimeUpdate);
	}

	updateProgress(time: number) {
		this.progressCounter.update(time, this.duration);
	}
}
