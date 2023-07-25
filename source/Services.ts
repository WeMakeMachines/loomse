import { singleton } from 'tsyringe';

import PluginRegistryService from './services/pluginRegistryService';
import ReporterService from './services/reporterService';
import ScriptedEventService from './services/scriptedEventService';
import Plugin, { PluginProps } from './components/Plugin';
import { StoryEvent } from './types/StoryType';
import Loomse from './Loomse';

@singleton()
export default class Services extends Loomse {
	constructor(
		public pluginRegistryService: PluginRegistryService,
		public reporterService: ReporterService,
		public scriptedEventService: ScriptedEventService,
		root: HTMLElement,
		json: object
	) {
		super(root, json);
	}

	currentDuration(): number {
		return this.reporterService.getCurrentDuration();
	}

	currentTime(): number {
		return this.reporterService.getCurrentTime();
	}

	currentScene(): string {
		return this.reporterService.getCurrentScene();
	}

	currentEvents(): StoryEvent[] {
		return this.scriptedEventService.events;
	}

	registerPlugin(pluginProps: PluginProps): void {
		const plugin = new Plugin(pluginProps);

		this.pluginRegistryService.registerPlugin(plugin);

		console.log(`Loomse: Plugin "${pluginProps.name}" registered`);
	}
}
