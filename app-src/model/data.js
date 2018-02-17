/**
 * Application shared data object
 */
let data = {};

const initialiseDataObject = () => {

	data = {
		dimensions: {
			width : null,
			height: null
		},
		script      : null,
		currentScene: null,
		sceneHistory: []
	};
};

export { data as default, initialiseDataObject };
