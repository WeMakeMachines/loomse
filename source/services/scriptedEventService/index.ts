import { eventService, EventServiceType } from '../eventService';
import { EventAction } from '../eventService/EventQueue';
import { broadcastDirectorSceneEvent } from '../radioService/broadcasters';
import { ScriptedEvent } from '../../types/scriptedStory';
import { pluginRegistry } from '../pluginRegistryService';

class ScriptedEventService {
	public eventService: EventServiceType | null = null;

	initialise(events: ScriptedEvent[]) {
		this.eventService = eventService({
			events,
			startEventCallback: this.start,
			stopEventCallback: this.stop
		});
	}

	start({ pluginName, payload }: ScriptedEvent) {
		if (pluginName) {
			const plugin = pluginRegistry.getPlugin(pluginName);

			if (plugin?.hooks.run) {
				plugin.hooks.run();
			}
		}

		broadcastDirectorSceneEvent({
			action: EventAction.START,
			payload
		});
	}

	stop({ pluginName, payload }: ScriptedEvent) {
		if (pluginName) {
			const plugin = pluginRegistry.getPlugin(pluginName);

			plugin?.unmount();
		}

		broadcastDirectorSceneEvent({
			action: EventAction.STOP,
			payload
		});
	}

	stopListeningToRadio() {
		if (!this.eventService) {
			return;
		}

		this.eventService.stopListeningToRadio();
	}
}

export const scriptedEventService = new ScriptedEventService();
