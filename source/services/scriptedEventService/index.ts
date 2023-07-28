import { mount } from 'redom';
import { injectable } from 'tsyringe';

import { SceneEvent } from '../../types/StoryType';
import { EventAction } from '../eventService/EventQueue';
import EventService from '../eventService';
import { broadcastDirectorSceneEvent } from '../radioService/broadcasters';
import PluginRegistryService from '../pluginRegistryService';

@injectable()
export default class ScriptedEventService extends EventService {
	constructor(private pluginRegistryService: PluginRegistryService) {
		super();
	}

	protected startEventCallback({ pluginName, payload }: SceneEvent) {
		if (pluginName) {
			const plugin = this.pluginRegistryService.getPlugin(pluginName);

			if (!plugin) {
				console.warn(`Plugin "${pluginName}" not registered`);

				return;
			}

			if (
				plugin.mount?.el &&
				plugin?.mount?.parentEl &&
				!plugin.mount.persist
			) {
				mount(plugin.mount.parentEl, plugin.mount.el);
			}

			if (plugin.hooks?.run) {
				plugin.hooks.run(payload);
			}
		}

		broadcastDirectorSceneEvent({
			action: EventAction.START,
			payload
		});
	}

	protected stopEventCallback({ pluginName, payload }: SceneEvent) {
		if (pluginName) {
			const plugin = this.pluginRegistryService.getPlugin(pluginName);

			if (!plugin) {
				console.warn(`Plugin "${pluginName}" not registered`);

				return;
			}

			if (plugin && !plugin.mount?.persist) {
				plugin?.unmount();
			}
		}

		broadcastDirectorSceneEvent({
			action: EventAction.STOP,
			payload
		});
	}
}
