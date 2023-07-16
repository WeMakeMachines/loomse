import { listenToDirectorSceneChange } from '../../services/radioService/listeners';

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
