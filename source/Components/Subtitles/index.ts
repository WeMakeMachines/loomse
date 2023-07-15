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

class SubtitlesError extends Error {}

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

		this.parseTextFile(filePath).catch((error) => {
			throw new SubtitlesError(
				`Unable to parse subtitles file, ${error.message}`
			);
		});
	}

	async parseTextFile(filePath: string) {
		this.fileContents = await getTextFile(filePath);
		this.cues = await parser(this.format, this.fileContents);

		this.eventService = eventService({
			events: Subtitles.mapCueToScriptedEvent(this.cues),
			startEventCallback: this.post,
			stopEventCallback: this.clear
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
