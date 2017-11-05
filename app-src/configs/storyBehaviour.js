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
		language: 'english',
		x       : 0.5,
		y       : 0.9
	}
};

export { storyBehaviour as default };