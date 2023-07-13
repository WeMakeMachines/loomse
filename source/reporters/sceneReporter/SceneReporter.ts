import { radioService } from '../../services/radioService';

import { DirectorEvent } from '../../types/broadcastChannels';

export default class SceneReporter {
	public currentScene: string;

	constructor() {
		this.currentScene = '';

		this.registerListeners();
	}

	registerListeners() {
		radioService.listenToChannel(
			DirectorEvent.SCENE_CHANGE,
			(sceneId: string) => {
				this.currentScene = sceneId;
			}
		);
	}
}
