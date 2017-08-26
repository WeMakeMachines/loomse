const storyBehaviour = {
	firstScene: 'intro',
	media     : {
		showPosterWhenPaused: false,
		fastForwardSkip     : 10,
		minimumSeekRange    : 1000,
		scaleVideoToViewport: true,
		defaultVideoWidth   : 800,
		defaultVideoHeight  : 800
	},
	subtitles: {
		active  : true,
		language: 'english'
	}
};

export { storyBehaviour as default };