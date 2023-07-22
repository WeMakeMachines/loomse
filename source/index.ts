import 'reflect-metadata';
import { container } from 'tsyringe';

import {
	listenToDirectorPlay,
	listenToDirectorPause,
	listenToDirectorSceneChange,
	listenToDirectorSceneEvent,
	listenToVideoTimeUpdate,
	listenToVideoDurationChanged
} from './services/radioService/listeners';
import Loomse from './Loomse';

type LoomseType = Loomse;

function createStory(root: HTMLElement, json: object): LoomseType {
	container.register('root', { useValue: root });
	container.register('json', { useValue: json });

	return container.resolve(Loomse);
}

export {
	createStory,
	LoomseType,
	listenToDirectorPlay,
	listenToDirectorPause,
	listenToDirectorSceneChange,
	listenToDirectorSceneEvent,
	listenToVideoTimeUpdate,
	listenToVideoDurationChanged
};
