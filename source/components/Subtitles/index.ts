import {
	Cue,
	extractFormatFromFileName,
	Format,
	parser
} from 'simple-subtitle-parser';

import { getTextFile } from '../../lib/browser/fetch';
import { SceneEvent } from '../../types/StoryType';

class SubtitlesError extends Error {}

export default class Subtitles {
	public cues: Cue[] | null = null;
	public filePath: string;
	public fileContents = '';
	public format: Format;

	static mapCueToScriptedEvent(cue: Cue[]): SceneEvent[] {
		return cue.map((cue) => ({
			in: cue.startTime.totals.inSeconds,
			out: cue.endTime.totals.inSeconds,
			payload: cue.text
		}));
	}

	constructor(filePath: string) {
		this.filePath = filePath;
		this.format = extractFormatFromFileName(filePath).format;

		this.getTextFile().catch((error) => {
			throw new SubtitlesError(
				`Unable to read subtitle file ${filePath}, ${error.message}`
			);
		});
	}

	private async getTextFile() {
		this.fileContents = await getTextFile(this.filePath);
	}

	async parseFileContents() {
		try {
			this.cues = await parser(this.format, this.fileContents);

			return Subtitles.mapCueToScriptedEvent(this.cues);
		} catch (error) {
			throw new SubtitlesError(
				`Unable to parse subtitles file, ${(error as Error).message}`
			);
		}
	}
}
