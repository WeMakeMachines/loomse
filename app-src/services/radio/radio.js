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
		return this.antenna.addEventListener(channel, data => {
			callback(data.detail);
		});
	}
}

export let radio;

export function initialiseRadio(node) {
	radio = new Radio(node);
}
