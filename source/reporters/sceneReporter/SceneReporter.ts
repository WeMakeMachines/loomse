import { radioService } from '../../services/radioService';

import { DirectorEvent } from '../../types/media';

export default class SceneReporter {
	public currentScene: string;

	constructor() {
		this.currentScene = '';

		this.registerListeners();
	}

	registerListeners() {
		radioService.register(DirectorEvent.SCENE_CHANGE, (sceneId: string) => {
			this.currentScene = sceneId;
		});
	}
}
