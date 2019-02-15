import { ajaxRequest } from '../';

import { plainTextFiles } from '../../constants';

import { SRT } from './types';

export {
	parseFile,
	getFileType,
	srt
};

/**
 * Parses the file into an array
 * @param {string} url
 * @param {string} [fileType]
 * @returns {object}
 */
async function parseFile(url, fileType) {
	if (!url || typeof url !== 'string') { return; }

	fileType = fileType || getFileType(url);

	const file = await ajaxRequest(url);

	let parsedFile;

	switch (fileType) {
		case plainTextFiles.SRT:
			parsedFile = await srt(file);
			break;
		default:
			Promise.reject('Unable to parse file');
	}

	return Promise.resolve(parsedFile);
}

function getFileType(url) {
	const fileName = url.split('/').pop();
	const fileExtension = fileName
		.split('.')
		.pop()
		.toLowerCase();

	return fileExtension;
}

function srt(rawText) {

	return new Promise((resolve, reject) => {

		if (typeof rawText !== 'string') { reject(); }

		const parsedData = new SRT(rawText);
		const blocks = parsedData.blocks;

		if (!blocks) { reject(); }

		resolve(parsedData.blocks);

	});
}
