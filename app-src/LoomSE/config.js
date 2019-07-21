const config = {};
const defaults = {
	modulesGlobalReference: 'loomSE_modules',
	scripts: {
		mobile: '',
		desktop: ''
	},
	mobile: {
		minimumResolution: 480
	},
	firstScene: 'intro',
	media: {
		showPosterWhenPaused: false,
		fastForwardSkip: 10,
		minimumSeekRange: 1000,
		videoFillMethod: 'cover'
	},
	subtitles: {
		active: false,
		language: '',
		x: 0.5,
		y: 0.9
	}
};

export default {
	...defaults,
	...config
};
