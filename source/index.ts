import 'reflect-metadata';
import { container } from 'tsyringe';

import { enableChangeToScenePlugin } from './plugins/changeToScene/changeToScene.config';
import {
	listenToDirectorPlay,
	listenToDirectorPause,
	listenToDirectorSceneChange,
	listenToDirectorSceneEvent,
	listenToVideoTimeUpdate,
	listenToVideoDurationChanged
} from './services/radioService/listeners';
import PluginRegistryService from './services/pluginRegistryService';
import ReporterService from './services/reporterService';
import ScriptedEventService from './services/scriptedEventService';
import Services from './Services';

type LoomseType = Services;

function createStory(root: HTMLElement, json: object): LoomseType {
	const services = new Services(
		container.resolve(PluginRegistryService),
		container.resolve(ReporterService),
		container.resolve(ScriptedEventService),
		root,
		json
	);

	enableChangeToScenePlugin(services);

	return services;
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
