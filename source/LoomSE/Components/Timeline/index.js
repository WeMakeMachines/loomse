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
			'#loomSE_timeline',
			{ style: { ...styles } },
			(this.progressCounter = new ProgressCounter())
		);
		this.duration = 999;

		this.tokenDurationChanged = radioService.register(
			VIDEO_DURATION_CHANGED,
			event => {
				this.duration = event.duration;
			}
		);

		this.tokenTimeUpdate = radioService.register(
			VIDEO_TIMEUPDATE,
			this.updateProgress,
			this
		);
	}

	updateProgress(event) {
		this.progressCounter.update(event.time, this.duration);
	}
}

export default Timeline;
