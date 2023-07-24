import { el } from 'redom';

import {
	VideoFileExtension,
	VideoMIME_Type
} from '../../types/VideoSourceTypes';

class SourceError extends Error {}

export default class Source {
	public el: HTMLSourceElement;

	static canPlayMimeType(videoMIME_Type: VideoMIME_Type): boolean {
		const videoElement = document.createElement('video');

		return Boolean(videoElement.canPlayType(videoMIME_Type));
	}

	static mapFileExtensionToMIME_Type(fileExtension: string) {
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

	constructor(fileExtension: string, uri: string) {
		const videoMIME_Type =
			Source.mapFileExtensionToMIME_Type(fileExtension);

		if (!Source.canPlayMimeType(videoMIME_Type)) {
			throw new SourceError(
				`Video format ${videoMIME_Type} not supported by browser`
			);
		}

		this.el = el('source', {
			src: uri,
			type: videoMIME_Type
		});
	}
}
