import { el } from 'redom';

import styles from './styles';
import Video from '../Video';

import { broadcastDirectorSceneChange } from '../../services/radioService/broadcasters';
import { scriptedEventService } from '../../services';
import { ScriptedScene } from '../../types/scriptedStory';

export default class Scene {
	public el: HTMLElement;
	public sceneName: string;
	public video: Video;
	public longName: string | undefined;

	constructor(sceneName: string, { events, longName, video }: ScriptedScene) {
		broadcastDirectorSceneChange(sceneName);

		this.el = el(
			'div',
			{ style: { ...styles } },
			(this.video = new Video(video))
		);

		this.sceneName = sceneName;
		this.longName = longName;

		scriptedEventService.setEvents(events);

		this.video.play();
	}

	onunmount() {
		scriptedEventService.stopListeningToRadio();
	}
}
