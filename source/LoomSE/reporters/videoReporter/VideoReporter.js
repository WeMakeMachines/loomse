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
		radioService.register(VIDEO_DURATION_CHANGED, event => {
			this.currentDuration = event.duration;
		});

		radioService.register(VIDEO_TIMEUPDATE, event => {
			this.currentTime = event.time;
		});
	}
}

export default VideoReporter;
