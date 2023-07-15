import { random } from '../../lib/common';

type Channel = string;
type ListenerToken = string;

/**
 * Underlying radio which ties the event mechanism together
 *
 * Each channel can have multiple listeners registered to it
 *
 * Listeners consist of a callback function, which is executed when the channel is broadcasting
 */
export class Radio {
	public registry: {
		[key: Channel]: {
			[key: ListenerToken]: (...args: any[]) => void;
		};
	} = {};

	/**
	 * Returns a random sequence of characters to the specified length
	 */
	static tokenGenerator(length: number): ListenerToken {
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

	/**
	 * Broadcast a message to all listeners on channel
	 *
	 * Executes listener handlers
	 */
	broadcastOnChannel(channel: Channel, signal?: any): void {
		if (!this.registry[channel]) {
			console.warn(`Channel ${channel} has no listeners`);

			return;
		}

		Object.values(this.registry[channel]).forEach((listener) =>
			listener(signal)
		);
	}

	/**
	 * Register a listener to a channel
	 *
	 * Returns a listener token, which is used to uniquely identify the listener
	 */
	listenToChannel(
		channel: Channel,
		handler: (...args: any[]) => void
	): string {
		const listenerToken: ListenerToken = Radio.tokenGenerator(32);

		if (!this.registry[channel]) {
			this.registry[channel] = {};
		}

		this.registry[channel][listenerToken] = handler;

		return listenerToken;
	}

	/**
	 * Remove a listener from a channel, using the unique listener token
	 */
	stopListening(listenerToken: ListenerToken): void {
		const channel = Object.keys(this.registry).filter((channel) => {
			const tokens = Object.keys(this.registry[channel]);

			return tokens.includes(listenerToken);
		})[0];

		if (!channel) {
			console.warn('Listener token not found');

			return;
		}

		delete this.registry[channel][listenerToken];

		if (!Object.keys(this.registry[channel]).length) {
			delete this.registry[channel];
		}
	}
}

export const radio = new Radio();
