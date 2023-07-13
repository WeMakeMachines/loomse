import { el } from 'redom';

import ProgressCounter from './ProgressCounter';
import styles from './styles';

import { radioService } from '../../services/radioService';
import { RadioChannel } from '../../types/radioChannels';

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
			RadioChannel.VIDEO_DURATION_CHANGED,
			(duration) => {
				this.duration = duration;
			}
		);

		this.tokenTimeUpdate = radioService.listenToChannel(
			RadioChannel.VIDEO_TIMEUPDATE,
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
