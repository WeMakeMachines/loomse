import {
	listenToVideoDurationChanged,
	listenToVideoTimeUpdate
} from '../../radioService/listeners';

/**
 * Listens to and keeps track of video events
 */
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
