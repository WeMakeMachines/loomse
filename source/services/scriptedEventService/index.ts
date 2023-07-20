import { ScriptedEvent } from '../../types/scriptedStory';
import { EventAction } from '../eventService/EventQueue';
import EventService from '../eventService';
import { broadcastDirectorSceneEvent } from '../radioService/broadcasters';
import { pluginRegistryService } from '../';

export default class ScriptedEventService {
	private eventService: EventService | null = null;

	initialise(events: ScriptedEvent[]) {
		this.eventService = new EventService({
			events,
			startEventCallback: this.start,
			stopEventCallback: this.stop
		});
	}

	getEvents(): ScriptedEvent[] {
		if (!this.eventService) return [];

		return this.eventService.queue.events;
	}

	start({ pluginName, payload }: ScriptedEvent) {
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

	stop({ pluginName, payload }: ScriptedEvent) {
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

	stopListeningToRadio() {
		if (!this.eventService) {
			return;
		}

		this.eventService.stopListeningToRadio();
	}
}
