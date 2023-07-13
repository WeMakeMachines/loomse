import { radioService } from '../../services/radioService';

import { VideoEvent } from '../../types/broadcastChannels';

export default class VideoReporter {
	public currentDuration = 0;
	public currentTime = 0;

	constructor() {
		this.registerListeners();
	}

	registerListeners() {
		radioService.register(
			VideoEvent.DURATION_CHANGED,
			(duration: number) => {
				this.currentDuration = duration;
			}
		);

		radioService.register(VideoEvent.TIMEUPDATE, (time: number) => {
			this.currentTime = time;
		});
	}
}
