class Radio {
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

export let radio;

export function initialiseRadio(node) {
	radio = new Radio(node);
}
