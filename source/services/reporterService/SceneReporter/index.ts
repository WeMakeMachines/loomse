import { listenToDirectorSceneChange } from '../../radioService/listeners';

/**
 * Listens to and keeps track of scene events
 */
export default class SceneReporter {
	public currentScene: string;

	constructor() {
		this.currentScene = '';

		this.registerListeners();
	}

	registerListeners() {
		listenToDirectorSceneChange((sceneId) => {
			this.currentScene = sceneId;
		});
	}
}
