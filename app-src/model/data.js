let data = {};

const initialiseDataObject = function() {

	data = {
		script      : null,
		currentScene: null,
		sceneHistory: [],
		modules     : null
	};
};

export { data as default, initialiseDataObject };