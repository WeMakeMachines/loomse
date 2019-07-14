import view from '../view';
import storyBehaviour from '../../constants/storyBehaviour';

import { Events, Subtitles, Video } from '../Components';

export class Scene {
	constructor(options) {
		this.longName = options.longName;
		this.video = new Video(options.video);
		this.events = new Events(options.events);

		this.mountComponents(this.video, this.events);

		if(storyBehaviour.subtitles.active) {
			this.subtitles = new Subtitles(options.video.subtitles);
			this.mountComponents(this.subtitles);
		}
	}

	mountComponents(...components) {
		components.forEach((component) => view.containers.stage.attach(component));
	}
}
