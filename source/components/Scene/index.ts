import { el } from 'redom';

import styles from './styles';

import Timeline from '../Timeline';
import Video from '../Video';

import { broadcastDirectorSceneChange } from '../../services/radioService/broadcasters';
import { ScriptedScene } from '../../types/scriptedStory';
import { scriptedEventService } from '../../services/scriptedEventService';

export default class Scene {
	public el: HTMLElement;
	public sceneId: string;
	public timeline: Timeline;
	public video: Video;
	public longName: string | undefined;

	constructor(sceneId: string, { events, longName, video }: ScriptedScene) {
		broadcastDirectorSceneChange(sceneId);

		this.el = el(
			'div',
			{ style: { ...styles } },
			(this.timeline = new Timeline()),
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
