export {
	secondsToMilliseconds,
	millisecondsToSeconds,
	millisecondsToClockString,
	clockStringToMilliseconds
};

const minutesInHours = 60;
const secondsInMinutes = 60;
const secondsInHours = minutesInHours * secondsInMinutes;
const millisecondsInSeconds = 1000;

function secondsToMilliseconds(time) {
	return time * millisecondsInSeconds;
}

function millisecondsToSeconds(time) {
	return time / millisecondsInSeconds;
}

/**
 * Turns seconds into hours, minutes, seconds
 * @param {number} milliseconds
 * @returns {object}
 */
function millisecondsToClockString(milliseconds) {
	let remainder = milliseconds / millisecondsInSeconds,
		hours,
		minutes,
		seconds,
		split;

	/**
	 * Normalises time display by adding a leading zero
	 * @param {number} number
	 * @returns {string}
	 */
	function addLeadingZero(number) {
		let string = number.toString();

		if (number < 10) {
			string = `0${string}`;
		}

		return string;
	}

	// find how many hours there are
	if (remainder >= secondsInHours) {
		hours = Math.floor(remainder / secondsInHours);
		remainder -= hours * secondsInHours;
	} else {
		hours = 0;
	}

	// find how many minutes there are
	if (remainder >= secondsInMinutes) {
		minutes = Math.floor(remainder / secondsInMinutes);
		remainder -= minutes * secondsInMinutes;
	} else {
		minutes = 0;
	}

	// find how many seconds
	if (remainder >= 1) {
		seconds = Math.floor(remainder);
		remainder -= seconds;
	} else {
		seconds = 0;
	}

	split = remainder.toString();

	if (split === '0') {
		split = '000';
	} else {
		split = split.substr(2, 3);
	}

	return {
		hours: addLeadingZero(hours),
		minutes: addLeadingZero(minutes),
		seconds: addLeadingZero(seconds),
		split
	};
}

/**
 * Converts a clock time (ie, 00:00:05,500) to ms
 * @param {string} string
 * @param {object} [separators]
 * @returns {object}
 */
function clockStringToMilliseconds(string, separators) {
	separators = Object.assign({}, separators, {
		major: ':',
		minor: ','
	});

	const parsedString = string.split(separators.major);
	const parsedDecimal = parsedString.pop().split(separators.minor);

	const hours = Number(parsedString[0]);
	const minutes = Number(parsedString[1]);
	const seconds = Number(parsedDecimal[0]);
	const milliseconds = Number(parsedDecimal[1]);

	let time = hours * minutesInHours;
	time = (time + minutes) * secondsInMinutes;
	time = (time + seconds) * millisecondsInSeconds;
	time += milliseconds;

	return time;
}
