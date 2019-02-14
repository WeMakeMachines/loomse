import { clockStringToMilliseconds } from '../../../tools';

export class SRT {

	static getBlockMarker(line) {
		const processedLine = Number(line);

		if (processedLine === 0 || isNaN(processedLine)) { return; }

		return processedLine;
	}

	static getTimes(line) {
		const marker = '-->';

		if (line.indexOf(marker) === -1) { return; }

		const lineAsArray = line.split(marker);

		return {
			in: clockStringToMilliseconds(lineAsArray[0]),
			out: clockStringToMilliseconds(lineAsArray[1])
		};
	}

	constructor(rawText) {
		this.rawText = rawText;
		this.lines = this.processLines();
		this.blocks = this.processBlocks();
	}

	processLines() {
		return this.rawText.split('\n');
	}

	processBlocks() {
		const initialValue = [];

		let index = 0;

		return this.lines.reduce((accumulator, line) => {
			const blockMarker = this.constructor.getBlockMarker(line);
			const blockTimes = this.constructor.getTimes(line);
			const lastEntry = accumulator[accumulator.length - 1];

			if (blockMarker && blockMarker === index + 1) {
				index += 1;

				accumulator.push({
					payload: {
						index: blockMarker,
						text: ''
					}
				});

			} else if(blockTimes) {
				lastEntry.in = blockTimes.in;
				lastEntry.out = blockTimes.out;
			} else {
				lastEntry.payload.text += line;
			}

			return accumulator;

		}, initialValue);
	}
}
