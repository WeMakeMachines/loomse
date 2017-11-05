/**
 * Subtitles handling and rendering
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
	 * @param {array} rawLines
	 */
	srt: (rawLines) => {
		const INTERFACE = {
			splitTimesChar: '>'
		};

		let parsedObject = {},
			string = '';

		for (let i = 0; i < rawLines.length;) {
			let currentLine = rawLines[i],
				isBlockIndex = !isNaN(Number(currentLine)),
				isNextBlockIndex = !isNaN(Number(rawLines[i + 1])),
				lastRecord = i === rawLines.length - 1,
				times;

			if (isBlockIndex) { // Handle index and times
				string = '';
				times = rawLines[i + 1];
				parsedObject = returnCleanedTimes(times, INTERFACE.splitTimesChar);
				i += 2;
			} else { // Handle strings
				if (string === '') {
					string = currentLine;
				} else {
					string += `\n${currentLine}`;
				}

				if (lastRecord || isNextBlockIndex) {
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
 * @param {string} string
 * @param {string} splitChar
 * @returns {object}
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
 * @param {array} array
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
 * @param {number} time
 * @returns {boolean}
 */
function check(time) {
	if (!active || subtitleIndex === subtitlesArray.length || !Boolean(~subtitleIndex)) { return false; }

	let currentSubtitle = subtitlesArray[subtitleIndex];

	if (!currentSubtitle.active && (currentSubtitle.in === time || currentSubtitle.in < time)) {

		subtitlesView.display(currentSubtitle.text);
		currentSubtitle.active = true;
	}

	if (currentSubtitle.out === time || currentSubtitle.out < time) {

		subtitlesView.remove();
		currentSubtitle.active = false;

		subtitleIndex += 1;
	}
}

/**
 * Restore current position if time index has been forced to change
 * @param {number} time
 */
function fix(time) {
	active = false;
	subtitlesView.remove();
	subtitleIndex = -1;

	for (let i = 0; i < subtitlesArray.length; i += 1) {
		let currentSubtitle = subtitlesArray[i];

		currentSubtitle.active = false;

		if (subtitleIndex === -1 && currentSubtitle.in > time) {
			subtitleIndex = i;
		}
	}

	active = true;
}

/**
 * Sets listeners for the HTML5 media object
 */
function addMediaListener() {
	media.parentElement.node.addEventListener('media:state:change', mediaListener, false);
}

/**
 * Removes the media listener
 */
function removeMediaListener() {
	media.parentElement.node.removeEventListener('media:state:change', mediaListener, false);
}

/**
 * Function which is triggered by the listener
 * @param {object} eventObject
 */
function mediaListener(eventObject) {
	let time = eventObject.detail.time,
		state = eventObject.detail.state;

	if (state === 'playing' || state === 'timeupdate') {
		check(time);
	}

	if (state === 'seeking') {
		fix(time);
	}
}

/**
 * Checks the validity of the file format
 * @param {string} format
 * @returns {boolean}
 */
function checkValidFormats(format) {
	return Boolean(validFormats.find((arrayItem) => arrayItem === format));
}

/**
 * Parses the file into an array
 * @param {string} url
 * @param {string} fileType
 * @returns {object}
 */
function parseFile(url, fileType) {
	let checkSubtitles = ajaxRequest(url),
		linesToArray = /[^\r\n]+/g;

	checkSubtitles.then((subtitles) => {
		subtitles = subtitles.match(linesToArray);

		fileTypes[fileType](subtitles);
	});

	checkSubtitles.catch((reason) => {
		report(reason);
	});

	return checkSubtitles;
}

const subtitles = {

	active,
	check,
	fix,

	on: () => {
		active = true;
		addMediaListener();
	},

	off: () => {
		active = false;
		removeMediaListener();
	},

	/**
	 * Initialises subtitling
	 * @param {string} url
	 * @returns {object}
	 */
	initialise(url) {
		let fileType = url.slice(-3);

		if (!checkValidFormats(fileType)) { return false; }
		subtitlesArray = [];

		return parseFile(url, fileType);
	}
};

export { subtitles as default };