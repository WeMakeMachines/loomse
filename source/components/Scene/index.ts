import { el, unmount } from 'redom';

import Video from '../Video';

import { broadcastDirectorSceneChange } from '../../services/radioService/broadcasters';
import ScriptedEventService from '../../services/scriptedEventService';
import { StoryScene } from '../../types/StoryType';

export default class Scene {
	public el: HTMLElement;
	public sceneName: string;
	public video: Video;
	public longName: string | undefined;

	constructor(
		private scriptedEventService: ScriptedEventService,
		sceneName: string,
		{ events, longName, video }: StoryScene
	) {
		broadcastDirectorSceneChange(sceneName);

		this.el = el('div.loomse__scene', (this.video = new Video(video)));
		this.sceneName = sceneName;
		this.longName = longName;

		this.scriptedEventService.setEvents(events);
		this.video.play();
	}

	onunmount() {
		this.scriptedEventService.resetService();
		unmount(this.el, this.video.el);
	}
}
