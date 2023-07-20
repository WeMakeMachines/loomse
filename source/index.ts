import 'reflect-metadata';
import Loomse from './Loomse';

import {
	listenToDirectorPlay,
	listenToDirectorPause,
	listenToDirectorSceneChange,
	listenToDirectorSceneEvent,
	listenToVideoTimeUpdate,
	listenToVideoDurationChanged
} from './services/radioService/listeners';

function createStory(root: HTMLElement, json: object): LoomseType {
	return Loomse.getInstance(root, json);
}

type LoomseType = Loomse;

export {
	LoomseType,
	createStory,
	listenToDirectorPlay,
	listenToDirectorPause,
	listenToDirectorSceneChange,
	listenToDirectorSceneEvent,
	listenToVideoTimeUpdate,
	listenToVideoDurationChanged
};
