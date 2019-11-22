import { radioService } from '../../services';

import { DIRECTOR_SCENE_CHANGE } from '../../constants/directorEvents';

class SceneReporter {
	constructor() {
		this.currentScene = '';

		this.registerListeners();
	}

	registerListeners() {
		radioService.register(DIRECTOR_SCENE_CHANGE, sceneId => {
			this.currentScene = sceneId;
		});
	}
}

export default SceneReporter;
