import VideoReporter from './VideoReporter';

const videoReporter = new VideoReporter();

export const getCurrentDuration = () => videoReporter.currentDuration;

export const getCurrentTime = () => videoReporter.currentTime;
