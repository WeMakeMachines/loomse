import state from '../state';

export const applicationAPI = {

	reload() {

	},

	pause() {

	},

	play() {
		const event = new CustomEvent('video:play');

		this.element.node.dispatchEvent(event);
	},

	seek() {

	},

	skip() {

	},

	status() {

	},

	currentTime() {
		return state.time;
	},

	duration() {

	}

};
