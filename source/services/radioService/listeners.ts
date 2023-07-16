import { radio } from './radio';
import { RadioChannel } from './channelTypes';

export type StopListeningFunction = () => void;

export const listenToDirectorPause = (
	handler: () => void
): StopListeningFunction =>
	radio.listenToChannel(RadioChannel.DIRECTOR_PAUSE, handler);

export const listenToDirectorPlay = (
	handler: () => void
): StopListeningFunction =>
	radio.listenToChannel(RadioChannel.DIRECTOR_PLAY, handler);

export const listenToDirectorSceneChange = (
	handler: (sceneId: string) => void
): StopListeningFunction =>
	radio.listenToChannel(RadioChannel.DIRECTOR_SCENE_CHANGE, handler);

export const listenToDirectorSceneEvent = (
	handler: (message: any) => void
): StopListeningFunction =>
	radio.listenToChannel(RadioChannel.DIRECTOR_SCENE_EVENT, handler);

export const listenToVideoDurationChanged = (
	handler: (duration: number) => void
): StopListeningFunction =>
	radio.listenToChannel(RadioChannel.VIDEO_DURATION_CHANGED, handler);

export const listenToVideoTimeUpdate = (
	handler: (time: number) => void
): StopListeningFunction =>
	radio.listenToChannel(RadioChannel.VIDEO_TIMEUPDATE, handler);
