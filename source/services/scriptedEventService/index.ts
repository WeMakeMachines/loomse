import { mount } from 'redom';
import { container, singleton } from 'tsyringe';

import { StoryEvent } from '../../types/StoryType';
import EventQueue, { EventAction } from '../eventService/EventQueue';
import EventService from '../eventService';
import { broadcastDirectorSceneEvent } from '../radioService/broadcasters';
import PluginRegistryService from '../pluginRegistryService';

@singleton()
export default class ScriptedEventService extends EventService {
	constructor(private pluginRegistryService: PluginRegistryService) {
		super(container.resolve(EventQueue));
	}

	public setEvents(events: StoryEvent[]) {
		super.setEvents(events);
	}

	protected startEventCallback({ pluginName, payload }: StoryEvent) {
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

	protected stopEventCallback({ pluginName, payload }: StoryEvent) {
		if (pluginName) {
			const plugin = this.pluginRegistryService.getPlugin(pluginName);

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
