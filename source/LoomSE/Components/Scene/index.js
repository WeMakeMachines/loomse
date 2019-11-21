import { el, setChildren } from 'redom';

import Events from '../Events';
import Video from '../Video';

import styles from './styles';

class Scene {
	constructor({ events, longName, video }) {
		this.el = el('#loomSE_scene', { style: { ...styles } });

		this.longName = longName;
		this.video = new Video(video);
		this.events = new Events(events);

		setChildren(this.el, [this.video.el]);
	}
}

export default Scene;
