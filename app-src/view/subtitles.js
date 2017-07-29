// Subtitles handling and rendering
// Since subtitles appear in a linear fashion (the next one always follows the previous one),
// we always keep on record the current subtitle to be displayed

import { ajaxRequest, report } from '../tools/common';
import config from '../configs/config';
import media from './media';
import view from './viewController';

export default (function () {
	let id = 'subtitle',
		container = document.createElement('div'),
		element = document.createElement('p'),
		isActive, // boolean which determines whether subtitles are on or off
		subtitlesArray = [], // our array which holds all of the subtitles
		arrayPosition = 0,
		activeTitle = [0, 0, null, false]; // the active title which we've pulled out of the array

	// this function parses the subtitle file
	function parse(url) {
		let rawSubs;

		// convert a string into an internal time our application can understand
		function convertToInternalTime(string, h, m, s, ms) {
			let hours = Number(string.slice(h[0], h[1])),
				minutes = Number(string.slice(m[0], m[1])),
				seconds = Number(string.slice(s[0], s[1])),
				milliseconds = Number(string.slice(ms[0], ms[1])) / 1000;

			return hours * 3600 + minutes * 60 + seconds + milliseconds;
		}

		// support for .srt files
		function srt(array) {
			let arrayPush = [],
				currentRecord,
				times,
				timeIn,
				timeOut,
				string = '';

			for (let i = 0; i < array.length; i += 1) {
				currentRecord = array[i];
				if (isNaN(currentRecord) === false) {
					// push old string to array
					if (i > 0) {
						arrayPush = [timeIn, timeOut, string];
						subtitlesArray.push(arrayPush);
						string = '';
					}
					// skip to next line, we're expecting the times now
					times = array[i + 1];
					timeIn = (function () {
						let string = times.slice(0, 12);

						return convertToInternalTime(string, [0, 2], [3, 5], [6, 8], [9, 12]);
					}());
					timeOut = (function () {
						let string = times.slice(17, 29);

						return convertToInternalTime(string, [0, 2], [3, 5], [6, 8], [9, 12]);
					}());
					i += 1;
				} else {
					string = string + ' ' + currentRecord;
				}
			}
		}

		// Pull the data from the subtitles file, and also determine what type of file we need to parse
		ajaxRequest(url, null, true, function (data) {
			if (data !== false) {
				rawSubs = data.match(/[^\r\n]+/g);
				// check the ending characters of the url to determine the type of file
				if (url.endsWith('srt')) {
					srt(rawSubs);
				}
			} else {
				isActive = false;
				if (config.behaviour.developer.verbose === 'subtitles') {
					report('[Subtitle] No valid subtitles found');
				}
			}
		});
	}

	// The main function we will call
	// Here we check the current subtitle record against the current media time and
	// determine whether the subtitle is ready to be displayed, or if it ready to be removed
	function check(time) {
		// Check if subtitles are active, and if so check if a subtitle is currently displayed
		if (isActive === true && activeTitle[3] === false) {
			let check = subtitlesArray[arrayPosition]; // pull current record and see if it is ready
			if (check[0] === time || check[0] < time) {

				// check if preceding subtitle still exists, if it does, remove it
				if (activeTitle[3] === true) {
					remove();
				}

				activeTitle = check;
				activeTitle[3] = true; // set visibility flag to true
				display(activeTitle[2]); // display subtitle
				arrayPosition += 1;
			}
		} else {
			// We assume a title is already displayed, so we check if it has expired yet
			if (activeTitle[3] === true && activeTitle[1] < time) {
				remove();
			}
		}
	}

	// Append our subtitle to the DOM
	function display(phrase) {
		if (isActive === true) {
			if (config.behaviour.developer.verbose === 'subtitles') {
				report('[Subtitle] ' + phrase);
			}
			element.innerHTML = phrase;
			view.containers.subtitles.appendChild(container);
			container.appendChild(element);
		}
	}

	// Removes a subtitle
	// If no time is specified, the function defaults to removing the current existing subtitle
	function remove(time) {
		function destroy() {
			if (activeTitle[3] === true) {
				activeTitle[3] = false;
				view.containers.subtitles.removeChild(container);
			}
		}

		// Check if time is defined
		if (time) {
			if ((activeTitle[1] === time || activeTitle[1] < time) && activeTitle[3] === true) {
				destroy();
			}
		} else {
			destroy();
		}
	}

	// Sometimes the media player will have been forced to move further ahead
	// or behind than what we are expecting, throwing our subtitles out of sync.
	// If that is the case, this function will rectify the situation by finding where the
	// current position should be in the array.
	function reset(time) {
		remove();
		if (typeof time === 'number' && time !== 0) {
			// find the next subtitle with the timecode
			for (let i = 0; i < subtitlesArray.length - 1; i += 1) {
				let currentRecord = subtitlesArray[i];
				if (time < currentRecord[0]) {
					arrayPosition = i;
					break;
				}
			}
		} else {
			arrayPosition = 0;
		}
	}

	return {
		parse  : parse, // parse subtitle file
		check  : check, // check if next subtitle is ready to be displayed
		display: display, // show the subtitle
		remove : remove, // remove existing subtitle
		reset  : reset, // reset subtitles (fixes to current time index)
		on     : function () {
			reset(media.object.currentTime);
			isActive = true;
		},
		off: function () {
			remove();
			isActive = false;
		}
	};
}());