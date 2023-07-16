import {
	listenToVideoDurationChanged,
	listenToVideoTimeUpdate
} from '../../services/radioService/listeners';

export default class VideoReporter {
	public currentDuration = 0;
	public currentTime = 0;

	constructor() {
		this.registerListeners();
	}

	registerListeners() {
		listenToVideoDurationChanged((duration) => {
			this.currentDuration = duration;
		});

		listenToVideoTimeUpdate((time) => {
			this.currentTime = time;
		});
	}
}
