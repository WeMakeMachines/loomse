import { ScriptedEvent } from '../../types/scriptedStory';
import { EventAction } from '../eventService/EventQueue';
import EventService from '../eventService';
import { broadcastDirectorSceneEvent } from '../radioService/broadcasters';
import { pluginRegistryService } from '../';

export default class ScriptedEventService extends EventService {
	public setEvents(events: ScriptedEvent[]) {
		super.setEvents(events);
	}

	protected startEventCallback({ pluginName, payload }: ScriptedEvent) {
		if (pluginName) {
			const plugin = pluginRegistryService.getPlugin(pluginName);

			if (plugin?.hooks?.run) {
				plugin.hooks.run();
			}
		}

		broadcastDirectorSceneEvent({
			action: EventAction.START,
			payload
		});
	}

	protected stopEventCallback({ pluginName, payload }: ScriptedEvent) {
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
