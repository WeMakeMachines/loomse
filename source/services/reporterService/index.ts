import { injectable } from 'tsyringe';

import SceneReporter from './SceneReporter';
import VideoReporter from './VideoReporter';

@injectable()
export default class ReporterService {
	constructor(
		private sceneReporter: SceneReporter,
		private videoReporter: VideoReporter
	) {}

	getCurrentTime(): number {
		return this.videoReporter.currentTime;
	}

	getCurrentDuration(): number {
		return this.videoReporter.currentDuration;
	}

	getCurrentScene(): string {
		return this.sceneReporter.currentScene;
	}
}
