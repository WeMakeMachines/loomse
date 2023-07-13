import { radio } from './radio';
import { RadioChannel } from './channels';

export const listenToDirectorPause = (handler: () => void): string =>
	radio.listenToChannel(RadioChannel.DIRECTOR_PAUSE, handler);

export const listenToDirectorPlay = (handler: () => void): string =>
	radio.listenToChannel(RadioChannel.DIRECTOR_PLAY, handler);

export const listenToDirectorSceneChange = (
	handler: (sceneId: string) => void
): string => radio.listenToChannel(RadioChannel.DIRECTOR_SCENE_CHANGE, handler);

export const listenToDirectorSceneEvent = (
	handler: (message: any) => void
): string => radio.listenToChannel(RadioChannel.DIRECTOR_SCENE_EVENT, handler);

export const listenToVideoDurationChanged = (
	handler: (duration: number) => void
): string =>
	radio.listenToChannel(RadioChannel.VIDEO_DURATION_CHANGED, handler);

export const listenToVideoTimeUpdate = (
	handler: (time: number) => void
): string => radio.listenToChannel(RadioChannel.VIDEO_TIMEUPDATE, handler);
