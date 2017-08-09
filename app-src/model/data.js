let data = {};

const initialiseDataObject = function() {

	data = {
		script      : null,
		currentScene: null,
		sceneHistory: []
	};
};

export { data as default, initialiseDataObject };