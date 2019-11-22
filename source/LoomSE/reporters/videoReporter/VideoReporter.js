import { radioService } from '../../services';

import {
	VIDEO_DURATION_CHANGED,
	VIDEO_TIMEUPDATE
} from '../../constants/videoEvents';

class VideoReporter {
	constructor() {
		this.currentDuration = 0;
		this.currentTime = 0;

		this.registerListeners();
	}

	registerListeners() {
		radioService.register(VIDEO_DURATION_CHANGED, duration => {
			this.currentDuration = duration;
		});

		radioService.register(VIDEO_TIMEUPDATE, time => {
			this.currentTime = time;
		});
	}
}

export default VideoReporter;
