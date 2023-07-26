import {
	Cue,
	extractFormatFromFileName,
	Format,
	parser
} from 'simple-subtitle-parser';

import { getTextFile } from '../../lib/browser/fetch';
import SubtitleEventService from '../../services/subtitleEventService';
import { StoryEvent } from '../../types/StoryType';

class SubtitlesError extends Error {}

export default class Subtitles {
	public cues: Cue[] | null = null;
	public filePath: string;
	public fileContents: string | null = null;
	public format: Format;

	static mapCueToScriptedEvent(cue: Cue[]): StoryEvent[] {
		return cue.map((cue) => ({
			in: cue.startTime.totals.inSeconds,
			out: cue.endTime.totals.inSeconds,
			payload: cue.text
		}));
	}

	constructor(
		private subtitleEventService: SubtitleEventService,
		filePath: string
	) {
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

		this.subtitleEventService.setEvents(
			Subtitles.mapCueToScriptedEvent(this.cues)
		);
	}
}
