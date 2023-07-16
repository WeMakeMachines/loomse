import { el } from 'redom';

import styles from './styles';
import Video from '../Video';

import { broadcastDirectorSceneChange } from '../../services/radioService/broadcasters';
import { scriptedEventService } from '../../services/scriptedEventService';
import { ScriptedScene } from '../../types/scriptedStory';

export default class Scene {
	public el: HTMLElement;
	public sceneId: string;
	public video: Video;
	public longName: string | undefined;

	constructor(sceneId: string, { events, longName, video }: ScriptedScene) {
		broadcastDirectorSceneChange(sceneId);

		this.el = el(
			'div',
			{ style: { ...styles } },
			(this.video = new Video(video))
		);

		this.sceneId = sceneId;
		this.longName = longName;

		scriptedEventService.initialise(events);

		this.video.play();
	}

	onunmount() {
		scriptedEventService.stopListeningToRadio();
	}
}
