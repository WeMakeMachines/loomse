import { container, singleton } from 'tsyringe';

import { StoryEvent } from '../../types/StoryType';
import EventQueue, { EventAction } from '../eventService/EventQueue';
import EventService from '../eventService';
import { broadcastDirectorSceneEvent } from '../radioService/broadcasters';
import { pluginRegistryService } from '../';

@singleton()
export default class ScriptedEventService extends EventService {
	constructor() {
		super(container.resolve(EventQueue));
	}

	public setEvents(events: StoryEvent[]) {
		super.setEvents(events);
	}

	protected startEventCallback({ pluginName, payload }: StoryEvent) {
		if (pluginName) {
			const plugin = pluginRegistryService.getPlugin(pluginName);

			if (!plugin) {
				console.warn(`Plugin "${pluginName}" not registered`);
			}

			if (plugin?.hooks?.run) {
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
			const plugin = pluginRegistryService.getPlugin(pluginName);

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
