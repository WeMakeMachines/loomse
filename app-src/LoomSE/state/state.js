const initialState = {
    time: 0,
	clientDimensions: {
		width : null,
		height: null
	},
	scene: null,
	events: [],
	history: [],
	language: 'en_GB'
};

class State {

	constructor(options) {
		this._time = options.time;
		this._clientDimensions = options.clientDimensions;
		this._scene = options.scene;
		this._history = options.history;
		this._events = options.events;
		this._language = options.language;
	}

	get events() {
		return this._events;
	}

	set events(events) {
		this._events = events;
	}

	get time() {
		return this._time;
    }

    set time(time) {
		this._time = time;
	}

	get language() {
		return this._language;
	}

	set language(language) {
		this._language = language;
	}

	get clientDimensions() {
		return this._clientDimensions;
	}

	set clientDimensions(dimensions) {
		if (typeof dimensions !== 'object') { return; }

		this._clientDimensions.width = dimensions.width;
		this._clientDimensions.height = dimensions.height;
	}

	get scene() {
		return this._scene;
	}

	set scene(scene) {
		this._scene = scene;
	}

	addToHistory(object) {
		this._history.push(object);
	}
}

export const state = new State(initialState);
