export { appConfig as default, setupAppConfig };

const defaults = {
	scriptJson: {},
	mobileScriptJson: {},
	scriptUri: '',
	mobileScriptUri: '',
	externalModules: '',
	resizeVideoTo: 'parent',
	videoStretchMethod: 'cover',
	mobileMinimumResolution: 480,
	subtitles: {
		active: false,
		x: 0.5,
		y: 0.9
	}
};

let appConfig = {
	...defaults
};

function setupAppConfig(options) {
	appConfig = {
		...defaults,
		...options
	};
}
