import { el } from 'redom';

import styles from './styles';

import Events from '../Events';
import Timeline from '../Timeline';
import Video from '../Video';

import { radioService } from '../../services/radioService';
import { DIRECTOR_SCENE_CHANGE } from '../../constants/directorEvents';

class Scene {
	constructor(sceneId, { events, longName, video }) {
		radioService.broadcast(DIRECTOR_SCENE_CHANGE, sceneId);

		this.el = el(
			'',
			{ style: { ...styles } },
			(this.timeline = new Timeline()),
			(this.video = new Video(video))
		);

		this.events = new Events(events);
		this.longName = longName;

		this.video.play();
	}
}

export default Scene;
