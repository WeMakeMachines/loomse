const config = {
	version      : '0.4.0',
	applicationID: 'loomSE',
	target       : 'loomSE',
	scriptFile   : 'assets/scripts/script-desktop.json',
	firstScene   : 'intro',
	resolution   : false,
	behaviour    : {
		media: {
			timeEventResolution : 0.4,
			showPosterWhenPaused: false,
			fastForwardSkip     : 10,
			minimum_resolution  : {
				width : 640,
				height: 480
			}
		},
		settings: {
			url      : 'http://localhost/',
			language : 'english',
			subtitles: true
		},
		subtitles: false,
		developer: {
			mute              : true,
			verbose           : 'subtitles',
			disableCheckScript: false,
			disableScrubScreen: false
		}
	}
};

let data = {
	script      : null,
	currentScene: null,
	modules     : null
};

export { config as default, data };
