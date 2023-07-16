import { el } from 'redom';

import ProgressCounter from './ProgressCounter';
import styles from './styles';

import {
	listenToVideoDurationChanged,
	listenToVideoTimeUpdate,
	StopListeningFunction
} from '../../services/radioService/listeners';

export default class Timeline {
	public duration = 999;

	public el: HTMLElement;
	public progressCounter: ProgressCounter;
	public stopListeningToDurationChanged: StopListeningFunction;
	public stopListeningToTimeUpdate: StopListeningFunction;

	constructor() {
		this.el = el(
			'div',
			{ style: { ...styles } },
			(this.progressCounter = new ProgressCounter())
		);

		this.stopListeningToDurationChanged = listenToVideoDurationChanged(
			(duration) => {
				this.duration = duration;
			}
		);
		this.stopListeningToTimeUpdate = listenToVideoTimeUpdate((time) =>
			this.updateProgress(time)
		);
	}

	onunmount() {
		this.stopListeningToRadio();
	}

	stopListeningToRadio() {
		this.stopListeningToDurationChanged();
		this.stopListeningToTimeUpdate();
	}

	updateProgress(time: number) {
		this.progressCounter.update(time, this.duration);
	}
}
