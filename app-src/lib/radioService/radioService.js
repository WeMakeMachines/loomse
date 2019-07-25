class RadioService {
	constructor(node) {
		this.antenna = node;
	}

	broadcast(channel, payload) {
		const event = new CustomEvent(channel, {
			detail: payload
		});

		this.antenna.dispatchEvent(event);
	}

	listen(channel, callback) {
		this.antenna.addEventListener(channel, callback);
	}

	stopListening(channel, callback) {
		this.antenna.removeEventListener(channel, callback);
	}
}

export let radioService;

export function initialiseRadio(node) {
	radioService = new RadioService(node);
}
