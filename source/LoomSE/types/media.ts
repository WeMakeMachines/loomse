export enum DirectorEvent {
	PLAY = 'director:play',
	PAUSE = 'director:pause',
	SCENE_CHANGE = 'director:scenechange',
	SCENE_EVENT = 'director:sceneevent'
}

export enum VideoEvent {
	ENDED = 'video:ended',
	DURATION_CHANGED = 'video:durationchange',
	PAUSED = 'video:paused',
	PLAYING = 'video:playing',
	SEEKED = 'video:seeked',
	SEEKING = 'video:seeking',
	TIMEUPDATE = 'video:timeupdate'
}
