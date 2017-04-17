// Generic helper functions

import { config } from './config';

export default {
	ajaxRequest: function (file, fileType, async, callback) {
		let data,
			xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {
					if (fileType === 'JSON') {
						data = JSON.parse(xmlhttp.responseText);
					} else {
						data = xmlhttp.responseText;
					}
					callback(data);
				} else {
					callback(false);
				}
			}
		};

		xmlhttp.open('GET', file, async);
		xmlhttp.send();
	},

	report: function (message) {
		// display report
		console.log(message);
	},

	displayError: function (errorMessage) {
		let errorText = '\n*** Error ***\n';
		// throw an exception
		throw errorText + errorMessage;
		//console.log(errorText + errorMessage);
	},

	random: function (minRange, maxRange) {
		let range = maxRange - minRange;
		if (typeof minRange === 'undefined') {
			minRange = 0;
		}
		if (range <= 0) {
			range = maxRange;
			minRange = 0;
		}
		// returns a random number between 1 and number
		return Math.floor(Math.random() * range) + minRange;
	},

	cleanString: function (string) {
		// removes whitespace, and converts to lowercase
		return string.replace(/\s+/g, '').toLowerCase();
	},

	newDOMobject: function (parent, type, id, cssClass, cssProperties) {

		let newObject = document.createElement(type),
			newObjectId = config.applicationID + '_' + id;

		if (parent) {
			parent.appendChild(newObject);
		}

		if (id) {
			newObject.setAttribute('id', newObjectId);
		}

		if (cssClass) {
			newObject.setAttribute('class', cssClass);
		}

		if (cssProperties) {
			css.style(newObject, cssProperties); // test for bug here with the reference
		}

		return newObject;
	},

	newElement: function (type, id, cssClass, style) {
		let object = document.createElement(type),
			objectId = config.applicationID + '_' + id;

		if (id) {
			object.setAttribute('id', objectId);
		}

		if (cssClass) {
			object.setAttribute('class', cssClass);
		}

		if (style) {
			css.style(object, style); // test for bug here with the reference
		}

		return object;
	},

	// turns seconds into hours, minutes, seconds
	clock: function (timeInSeconds) {
		let remainder = timeInSeconds,
			hours,
			minutes,
			seconds,
			split;

		// find how many hours there are
		if (remainder >= 3600) {
			hours = Math.floor(remainder / 3600);
			remainder = remainder - hours * 3600;
		} else {
			hours = 0;
		}

		// find how many minutes there are
		if (remainder >= 60) {
			minutes = Math.floor(remainder / 60);
			remainder = remainder - minutes * 60;
		} else {
			minutes = 0;
		}

		// find how many seconds
		if (remainder >= 1) {
			seconds = Math.floor(remainder);
			remainder = remainder - seconds;
		} else {
			seconds = 0;
		}

		split = remainder.toString();

		if (split === '0') {
			split = '000';
		}
		else {
			split = split.substr(2, 3);
		}

		function addLeadingZero(number) {
			if (number < 10) {
				number = '0' + number;
			}

			return number;
		}

		return {
			hours: addLeadingZero(hours),
			minutes: addLeadingZero(minutes),
			seconds: addLeadingZero(seconds),
			split: split
		};
	}
};