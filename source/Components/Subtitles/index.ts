import {
	Cue,
	extractFormatFromFileName,
	Format,
	parser
} from 'simple-subtitle-parser';

import { getTextFile } from '../../lib/browser/fetch';
import { eventService, EventService } from '../../services/eventService';
import {
	broadcastSubtitleClear,
	broadcastSubtitlePost
} from '../../services/radioService/broadcast';
import { ScriptedEvent } from '../../types/scriptedStory';

export default class Subtitles {
	public cues: Cue[] | null = null;
	public filePath: string;
	public fileContents: string | null = null;
	public format: Format;
	public eventService: EventService | null = null;

	static mapCueToScriptedEvent(cue: Cue[]): ScriptedEvent[] {
		return cue.map((cue) => ({
			in: cue.startTime,
			out: cue.endTime,
			payload: cue.text
		}));
	}

	constructor(filePath: string) {
		this.filePath = filePath;

		this.format = extractFormatFromFileName(filePath).format;

		getTextFile(filePath)
			.then((text) => {
				this.fileContents = text;
				parser(this.format, text).then((cues) => {
					this.cues = cues;
					this.eventService = eventService({
						events: Subtitles.mapCueToScriptedEvent(cues),
						startEventCallback: this.post,
						stopEventCallback: this.clear
					});
				});
			})
			.catch((error) => {
				this.fileContents = null;
				console.warn('Unable to activate subtitles');
				console.warn(error);
			});
	}

	post({ payload }: ScriptedEvent) {
		broadcastSubtitlePost(payload);
	}

	clear() {
		broadcastSubtitleClear();
	}

	stopListeningToRadio() {
		if (this.eventService) {
			this.eventService.stopListeningToRadio();
		}
	}
}
