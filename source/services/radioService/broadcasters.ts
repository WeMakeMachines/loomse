import { radio } from './radio';

import { RadioChannel } from './channelTypes';
import { EventAction } from '../eventService/EventQueue';

export const broadcastDirectorPause = () =>
	radio.broadcastOnChannel(RadioChannel.DIRECTOR_PAUSE);

export const broadcastDirectorPlay = () =>
	radio.broadcastOnChannel(RadioChannel.DIRECTOR_PLAY);

export const broadcastDirectorSceneChange = (sceneId: string) =>
	radio.broadcastOnChannel(RadioChannel.DIRECTOR_SCENE_CHANGE, sceneId);

export const broadcastDirectorSceneEvent = (signal: {
	action: EventAction;
	payload: any;
}) =>
	radio.broadcastOnChannel(RadioChannel.DIRECTOR_SCENE_EVENT, {
		action: signal.action,
		message: signal.payload
	});

export const broadcastVideoEnded = () =>
	radio.broadcastOnChannel(RadioChannel.VIDEO_ENDED);

export const broadcastVideoDurationChanged = (duration: number) =>
	radio.broadcastOnChannel(RadioChannel.VIDEO_DURATION_CHANGED, duration);

export const broadcastVideoPaused = () =>
	radio.broadcastOnChannel(RadioChannel.VIDEO_PAUSED);

export const broadcastVideoPlaying = (currentTime: number) =>
	radio.broadcastOnChannel(RadioChannel.VIDEO_PLAYING, currentTime);

export const broadcastVideoSeeked = (currentTime: number) =>
	radio.broadcastOnChannel(RadioChannel.VIDEO_SEEKED, currentTime);

export const broadcastVideoSeeking = (currentTime: number) =>
	radio.broadcastOnChannel(RadioChannel.VIDEO_SEEKING, currentTime);

export const broadcastVideoTimeUpdate = (currentTime: number) =>
	radio.broadcastOnChannel(RadioChannel.VIDEO_TIMEUPDATE, currentTime);

export const broadcastSubtitlePost = (subtitle: string) =>
	radio.broadcastOnChannel(RadioChannel.SUBTITLE_POST, subtitle);

export const broadcastSubtitleClear = () =>
	radio.broadcastOnChannel(RadioChannel.SUBTITLE_CLEAR);
