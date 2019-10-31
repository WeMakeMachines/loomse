import Component from '../../Abstract';

import {
	MP4,
	OGG,
	WEBM,
	VIDEO_MP4,
	VIDEO_OGG,
	VIDEO_WEBM
} from '../../../constants/videoSourceTypes';

class SourceError extends Error {}

export class Source {
	static mapFileFormatToMediaType(fileFormat) {
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

	constructor(type, uri) {
		this.element = new Component({ type: 'source' });
		this.element.setAttributes({
			src: uri,
			type: this.constructor.mapFileFormatToMediaType(type)
		});
	}
}
