import { el, unmount } from 'redom';
import { container } from 'tsyringe';

import { broadcastDirectorSceneChange } from '../../services/radioService/broadcasters';
import ScriptedEventService from '../../services/scriptedEventService';
import SubtitleEventService from '../../services/subtitleEventService';
import { StoryScene } from '../../types/StoryType';
import Video from '../Video';

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

		this.el = el(
			'div.loomse__scene',
			(this.video = new Video(
				container.resolve(SubtitleEventService),
				video
			))
		);
		this.sceneName = sceneName;
		this.longName = longName;
		this.scriptedEventService.setEvents(events);
		this.video.play();
	}

	cleanup() {
		this.scriptedEventService.dispose();
		unmount(this.el, this.video.el);
	}
}
