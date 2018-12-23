/**
 * Application shared state object
 */

const initialState = {
	dimensions: {
		width : null,
		height: null
	},
	script      : null,
	currentScene: null,
	sceneHistory: []
};

export class State {

	constructor(state) {
		this.dimensions = state.dimensions;
		this.script = state.script;
		this.currentScene = state.currentScene;
		this.sceneHistory = state.sceneHistory;
	}
}

export const state = new State(initialState);
