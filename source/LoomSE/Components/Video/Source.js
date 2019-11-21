import { el } from 'redom';

import {
	MP4,
	OGG,
	WEBM,
	VIDEO_MP4,
	VIDEO_OGG,
	VIDEO_WEBM
} from '../../constants/videoSourceTypes';

class SourceError extends Error {}

class Source {
	constructor(type, uri) {
		this.node = el('source', {
			src: uri,
			type: this.mapFileFormatToMediaType(type)
		});
	}

	mapFileFormatToMediaType(fileFormat) {
		switch (fileFormat) {
			case MP4:
				return VIDEO_MP4;
			case OGG:
				return VIDEO_OGG;
			case WEBM:
				return VIDEO_WEBM;
			default:
				throw new SourceError('Unable to process source in Video file');
		}
	}
}

export default Source;
