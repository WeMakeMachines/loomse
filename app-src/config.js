const config = {
	version: '0.4.0',
	appName: 'loomSE',
	appRoot: 'loomSE',
	scripts: {
		mobile : 'assets/scripts/script-mobile.json',
		desktop: 'assets/scripts/script-desktop.json'
	},
	firstScene: 'intro',
	resolution: false,
	behaviour : {
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

export { config as default };
