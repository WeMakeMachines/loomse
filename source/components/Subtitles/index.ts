import {
	Cue,
	extractFormatFromFileName,
	Format,
	parser
} from 'simple-subtitle-parser';

import { getTextFile } from '../../lib/browser/fetch';
import { ScriptedEvent } from '../../types/scriptedStory';
import { subtitleEventService } from '../../services';

class SubtitlesError extends Error {}

export default class Subtitles {
	public cues: Cue[] | null = null;
	public filePath: string;
	public fileContents: string | null = null;
	public format: Format;

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

		subtitleEventService.initialise(
			Subtitles.mapCueToScriptedEvent(this.cues)
		);
	}
}
