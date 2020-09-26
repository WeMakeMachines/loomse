import { el } from 'redom';

import ProgressCounter from './ProgressCounter';
import styles from './styles';

import {
	VIDEO_DURATION_CHANGED,
	VIDEO_TIMEUPDATE
} from '../../constants/videoEvents';
import { radioService } from '../../services';

class Timeline {
	constructor() {
		this.el = el(
			'',
			{ style: { ...styles } },
			(this.progressCounter = new ProgressCounter())
		);
		this.duration = 999;

		this.tokenDurationChanged = radioService.register(
			VIDEO_DURATION_CHANGED,
			duration => {
				this.duration = duration;
			}
		);

		this.tokenTimeUpdate = radioService.register(
			VIDEO_TIMEUPDATE,
			this.updateProgress,
			this
		);
	}

	updateProgress(time) {
		this.progressCounter.update(time, this.duration);
	}
}

export default Timeline;
