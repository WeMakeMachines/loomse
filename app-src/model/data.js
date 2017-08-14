let data = {};

const initialiseDataObject = () => {

	data = {
		script      : null,
		currentScene: null,
		sceneHistory: []
	};
};

export { data as default, initialiseDataObject };