const scriptBehaviour = {
	firstScene: 'intro',
	media     : {
		showPosterWhenPaused: false,
		fastForwardSkip     : 10,
		minimum_resolution  : {
			width : 640,
			height: 480
		},
		minimum_seek_range: 1000
	},
	subtitles: {
		active  : true,
		language: 'english'
	}
};

export { scriptBehaviour as default };