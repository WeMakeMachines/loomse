/**
 * Subtitles handling and rendering
 * Since subtitles appear in a linear fashion (the next one always follows the previous one),
 * -> we always keep on record the current subtitle to be displayed
 *
 */

import { ajaxRequest, report } from '../tools/common';
import media from '../view/media';
import subtitlesView from '../view/subtitles';

const validFormats = ['srt'];

let active = false,
	subtitlesArray,
	subtitleIndex = 0;

const fileTypes = {

	/**
	 * Support for .srt files
	 * @param {Array} rawLines
	 */
	srt: (rawLines) => {
		const INTERFACE = {
			splitTimesChar: '>'
		};

		let parsedObject = {},
			string = '';

		for (let i = 0; i < rawLines.length;) {
			let currentLine = rawLines[i],
				isBlockMarker = !isNaN(Number(currentLine)),
				isNextBlockMarker = !isNaN(Number(rawLines[i + 1])),
				lastRecord = i === rawLines.length - 1,
				time;

			if (isBlockMarker) { // Handle index and times
				string = '';
				time = rawLines[i + 1];
				parsedObject = returnCleanedTimes(time, INTERFACE.splitTimesChar);

				i += 2;
			} else { // Handle strings
				if (string === '') {
					string = currentLine;
				} else {
					string += `\n${currentLine}`;
				}

				if (lastRecord || isNextBlockMarker) {
					parsedObject.text = string;
					subtitlesArray.push(parsedObject);
					parsedObject = {};
				}

				i += 1;
			}
		}
	}
};

/**
 * Returns a cleaned up time object
 * @param {String} string
 * @param {String} splitChar
 * @returns {Object}
 */
function returnCleanedTimes(string, splitChar) {
	let time = {},
		returnNumbers = /(?:\d*\.)?\d+/g,
		splitTimes = string.split(splitChar);

	time.in = splitTimes[0].match(returnNumbers);
	time.out = splitTimes[1].match(returnNumbers);

	time.in = convertToInternalTime(time.in);
	time.out = convertToInternalTime(time.out);

	return time;
}

/**
 * Converts a string into an internal time our application can understand
 * @param {Array} array
 * @returns {number}
 */
function convertToInternalTime(array) {
	const MINUTES_IN_HOURS = 60;
	const SECONDS_IN_MINUTES = 60;
	const MILLISECONDS_IN_SECONDS = 1000;

	let hours = Number(array[0]),
		minutes = Number(array[1]),
		seconds = Number(array[2]),
		milliseconds = Number(array[3]),
		time;

	time = hours * MINUTES_IN_HOURS;
	time = (time + minutes) * SECONDS_IN_MINUTES;
	time = (time + seconds) * MILLISECONDS_IN_SECONDS;

	return time + milliseconds;
}

/**
 * Here we check the current subtitle record against the current media time and
 * determine whether the subtitle is ready to be displayed, or if it ready to be removed
 * @param {Number} time
 */
function check(time) {
	if (!active || subtitleIndex === subtitlesArray.length) { return false; }

	let currentSubtitle = subtitlesArray[subtitleIndex];

	if (currentSubtitle.in === time || currentSubtitle.in < time) {
		console.log(currentSubtitle.text);
		subtitleIndex += 1;
	}
}

/**
 * Sometimes the media player will have been forced to move further ahead
 * or behind than what we are expecting, throwing our subtitles out of sync.
 * If that is the case, this function will rectify the situation by finding where the
 * current position should be in the array.
 * @param {Number} time
 */
function reset(time) {
	subtitlesView.remove();
}

/**
 * Sets listeners for the HTML5 media object
 */
function addMediaListener() {
	media.parentElement.addEventListener('media:state:change', mediaListener, false);
}

/**
 * Removes the media listener
 */
function removeMediaListener() {
	media.parentElement.removeEventListener('media:state:change', mediaListener, false);
}

/**
 * Function which is triggered by the listener
 * @param {Object} eventObject
 */
function mediaListener(eventObject) {
	let time = eventObject.detail.time;

	check(time);
}

/**
 * Checks the validity of the file format
 * @param {String} format
 * @returns {boolean}
 */
function checkValidFormats(format) {
	return Boolean(validFormats.find((arrayItem) => arrayItem === format));
}

/**
 * Parses the file into an array
 * @param {String} url
 * @param {String} fileType
 * @returns {Object}
 */
function parseFile(url, fileType) {
	let checkSubtitles = ajaxRequest(url),
		linesToArray = /[^\r\n]+/g;

	checkSubtitles.then((subtitles) => {
		subtitles = subtitles.match(linesToArray);

		switch (fileType) {
			case 'srt':
				fileTypes.srt(subtitles);
				break;
		}
	});

	checkSubtitles.catch((reason) => {
		report(reason);
	});

	return checkSubtitles;
}

const subtitles = {

	/**
	 * Initialises subtitling
	 * @param {String} url
	 * @returns {Object}
	 */
	initialise: (url) => {
		let fileType = url.slice(-3);

		if (!checkValidFormats(fileType)) { return false; }
		subtitlesArray = [];

		return parseFile(url, fileType);
	},

	on: () => {
		active = true;
		addMediaListener();
	},

	off: () => {
		active = false;
		removeMediaListener();
	},

	active,
	check,
	reset
};

export { subtitles as default };