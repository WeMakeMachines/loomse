import { el, unmount } from 'redom';

import Video from '../Video';

import { broadcastDirectorSceneChange } from '../../services/radioService/broadcasters';
import { scriptedEventService } from '../../services';
import { StoryScene } from '../../types/StoryType';

export default class Scene {
	public el: HTMLElement;
	public sceneName: string;
	public video: Video;
	public longName: string | undefined;

	constructor(sceneName: string, { events, longName, video }: StoryScene) {
		broadcastDirectorSceneChange(sceneName);

		this.el = el('div.loomse__scene', (this.video = new Video(video)));

		this.sceneName = sceneName;
		this.longName = longName;

		scriptedEventService.setEvents(events);

		this.video.play();
	}

	onunmount() {
		scriptedEventService.stopListeningToRadio();
		unmount(this.el, this.video.el);
	}
}
