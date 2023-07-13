import { el } from 'redom';

import styles from './styles';

import Events from '../Events';
import Timeline from '../Timeline';
import Video from '../Video';

import { broadcastDirectorSceneChange } from '../../services/radioService/broadcast';
import { ScriptedScene } from '../../types/scriptedStory';

export default class Scene {
	public el: HTMLElement;
	public sceneId: string;
	public timeline: Timeline;
	public video: Video;
	public events: Events;
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
		this.events = new Events(events);
		this.longName = longName;

		this.video.play();
	}

	onunmount() {
		this.events.stopListeningToRadio();
	}
}
