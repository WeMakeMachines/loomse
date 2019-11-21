import { el, setChildren } from 'redom';

import Events from '../Events';
import Video from '../Video';

class Scene {
	constructor({ events, longName, video }) {
		this.node = el('#loomSE_scene');

		this.longName = longName;
		this.video = new Video(video);
		this.events = new Events(events);

		setChildren(this.node, [this.video.node]);
	}
}

export default Scene;
