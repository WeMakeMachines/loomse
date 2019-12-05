import { random } from '../../lib/common';

class RadioService {
	/**
	 * Returns a random sequence of characters to the specified length
	 * @param {number} length
	 * @returns {string}
	 */
	static tokenGenerator(length) {
		if (typeof length !== 'number') {
			throw new Error('Length not a number');
		}

		const token = [];

		for (let i = 0; i < length; i += 1) {
			let randomNumber;

			do {
				randomNumber = random(48, 122);
			} while (
				// avoid characters that are not 0-0, a-z, A-Z
				(randomNumber > 57 && randomNumber < 65) ||
				(randomNumber > 90 && randomNumber < 97)
			);

			token.push(String.fromCharCode(randomNumber));
		}

		return token.join('');
	}

	constructor() {
		this.registry = {};
	}

	broadcast(channel, message) {
		if (!this.registry[channel]) {
			console.warn('Channel not registered:', channel);

			return;
		}

		Object.values(this.registry[channel]).forEach(listener => {
			listener.handler.call(listener.context, message);
		});
	}

	unRegister(token) {
		const channel = Object.keys(this.registry).filter(channel => {
			const tokens = Object.keys(this.registry[channel]);

			return tokens.includes(token);
		});

		if (!channel) {
			console.warn('Token not found');

			return;
		}

		delete this.registry[channel][token];

		if (!Object.keys(this.registry[channel]).length) {
			delete this.registry[channel];
		}
	}

	register(channel, handler, context) {
		const handlerToken = this.constructor.tokenGenerator(32);

		if (!this.registry[channel]) {
			this.registry[channel] = {};
		}

		this.registry[channel][handlerToken] = { handler, context };

		return handlerToken;
	}
}

export default RadioService;
