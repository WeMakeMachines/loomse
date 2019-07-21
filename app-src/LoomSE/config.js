export { config as default, setupConfig };

const defaults = {
	mobile: {
		minimumResolution: 480
	},
	subtitles: {
		active: false,
		x: 0.5,
		y: 0.9
	}
};

let config = {
	...defaults
};

function setupConfig(options) {
	config = {
		...defaults,
		...options
	};
}
