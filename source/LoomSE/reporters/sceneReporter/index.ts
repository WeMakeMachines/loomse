import SceneReporter from './SceneReporter';

const sceneReporter = new SceneReporter();

export const getCurrentScene = () => sceneReporter.currentScene;
