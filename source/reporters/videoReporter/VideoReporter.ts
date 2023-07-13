import { radioService } from '../../services/radioService';

import { RadioChannel } from '../../types/radioChannels';

export default class VideoReporter {
	public currentDuration = 0;
	public currentTime = 0;

	constructor() {
		this.registerListeners();
	}

	registerListeners() {
		radioService.listenToChannel(
			RadioChannel.VIDEO_DURATION_CHANGED,
			(duration: number) => {
				this.currentDuration = duration;
			}
		);

		radioService.listenToChannel(RadioChannel.VIDEO_TIMEUPDATE, (time: number) => {
			this.currentTime = time;
		});
	}
}
