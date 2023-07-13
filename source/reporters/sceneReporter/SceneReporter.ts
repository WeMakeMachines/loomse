import { radioService } from '../../services/radioService';

import { RadioChannel } from '../../types/radioChannels';

export default class SceneReporter {
	public currentScene: string;

	constructor() {
		this.currentScene = '';

		this.registerListeners();
	}

	registerListeners() {
		radioService.listenToChannel(
			RadioChannel.DIRECTOR_SCENE_CHANGE,
			(sceneId: string) => {
				this.currentScene = sceneId;
			}
		);
	}
}
