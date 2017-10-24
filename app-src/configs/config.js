const config = {
	appName: 'loomSE',
	appRoot: 'loomSE',
	version: '0.4.0',
	scripts: {
		mobile : 'assets/scripts/script-mobile.json',
		desktop: 'assets/scripts/script-desktop.json'
	},
	showLoadingPage: true,
	developer      : {
		mute              : true,
		disableCheckScript: false,
		disableScrubScreen: false,
		verbose           : ['subtitles'],
		checkVerbose      : function(string) {
			return Boolean(this.verbose.find((arrayItem) => arrayItem === string));
		}
	}
};

export { config as default };