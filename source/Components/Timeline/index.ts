import { el } from 'redom';

import ProgressCounter from './ProgressCounter';
import styles from './styles';

import { VideoEvent } from '../../types/broadcastChannels';
import { radioService } from '../../services/radioService';

export default class Timeline {
	public duration = 999;

	public el: HTMLElement;
	public progressCounter: ProgressCounter;
	public radioUnregisterTokenDurationChanged: string;
	public radioUnregisterTokenTimeUpdate: string;

	constructor() {
		this.el = el(
			'div',
			{ style: { ...styles } },
			(this.progressCounter = new ProgressCounter())
		);

		this.radioUnregisterTokenDurationChanged = radioService.register(
			VideoEvent.DURATION_CHANGED,
			(duration) => {
				this.duration = duration;
			}
		);

		this.radioUnregisterTokenTimeUpdate = radioService.register(
			VideoEvent.TIMEUPDATE,
			this.updateProgress,
			this
		);
	}

	onunmount() {
		this.stopListeningToRadio();
	}

	stopListeningToRadio() {
		radioService.unRegister(this.radioUnregisterTokenDurationChanged);
		radioService.unRegister(this.radioUnregisterTokenTimeUpdate);
	}

	updateProgress(time: number) {
		this.progressCounter.update(time, this.duration);
	}
}
