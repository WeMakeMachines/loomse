import { el } from 'redom';

import ProgressCounter from './ProgressCounter';
import styles from './styles';

import { VideoEvent } from '../../types/broadcastChannels';
import { radioService } from '../../services/radioService';

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

		this.tokenDurationChanged = radioService.listenToChannel(
			VideoEvent.DURATION_CHANGED,
			(duration) => {
				this.duration = duration;
			}
		);

		this.tokenTimeUpdate = radioService.listenToChannel(
			VideoEvent.TIMEUPDATE,
			this.updateProgress,
			this
		);
	}

	onunmount() {
		this.stopListeningToRadio();
	}

	stopListeningToRadio() {
		radioService.stopListening(this.tokenDurationChanged);
		radioService.stopListening(this.tokenTimeUpdate);
	}

	updateProgress(time: number) {
		this.progressCounter.update(time, this.duration);
	}
}
