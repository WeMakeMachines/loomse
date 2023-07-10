import { el } from 'redom';

import {
	VideoFileExtension,
	VideoMIME_Type
} from '../../types/videoSourceTypes';

class SourceError extends Error {}

export default class Source {
	public el: HTMLSourceElement;

	constructor(fileExtension: string, uri: string) {
		this.el = el('source', {
			src: uri,
			type: this.mapFileExtensionToMIME_Type(fileExtension)
		});
	}

	mapFileExtensionToMIME_Type(fileExtension: string) {
		switch (fileExtension) {
			case VideoFileExtension.MP4:
				return VideoMIME_Type.MP4;
			case VideoFileExtension.OGG:
				return VideoMIME_Type.OGG;
			case VideoFileExtension.WEBM:
				return VideoMIME_Type.WEBM;
			default:
				throw new SourceError('Unable to process source in Video file');
		}
	}
}
