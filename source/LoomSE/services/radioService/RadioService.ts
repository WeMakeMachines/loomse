import { random } from '../../lib/common';

export default class RadioService {
	public registry: {
		[key: string]: {
			[key: string]: {
				handler: (...args: any[]) => void;
				context?: void;
			};
		};
	} = {};

	/**
	 * Returns a random sequence of characters to the specified length
	 * @param {number} length
	 * @returns {string}
	 */
	static tokenGenerator(length: number) {
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

	broadcast(channel: string, message?: any) {
		if (!this.registry[channel]) {
			console.warn('Channel not registered:', channel);

			return;
		}

		Object.values(this.registry[channel]).forEach((listener) => {
			listener.handler.call(listener.context, message);
		});
	}

	unRegister(token: string) {
		const channel = Object.keys(this.registry).filter((channel) => {
			const tokens = Object.keys(this.registry[channel]);

			return tokens.includes(token);
		})[0];

		if (!channel) {
			console.warn('Unregister token not found');

			return;
		}

		// @ts-ignore
		delete this.registry[channel][token];

		// @ts-ignore
		if (!Object.keys(this.registry[channel]).length) {
			// @ts-ignore
			delete this.registry[channel];
		}
	}

	register(
		channel: string,
		handler: (...args: any[]) => void,
		context?: any
	) {
		const handlerToken = RadioService.tokenGenerator(32);

		if (!this.registry[channel]) {
			this.registry[channel] = {};
		}

		this.registry[channel][handlerToken] = { handler, context };

		return handlerToken;
	}
}
