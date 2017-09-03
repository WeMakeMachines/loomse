const storyBehaviour = {
	firstScene: 'intro',
	media     : {
		showPosterWhenPaused: false,
		fastForwardSkip     : 10,
		minimumSeekRange    : 1000,
		videoFillMethod     : 'cover'
	},
	subtitles: {
		active  : true,
		language: 'english'
	}
};

export { storyBehaviour as default };