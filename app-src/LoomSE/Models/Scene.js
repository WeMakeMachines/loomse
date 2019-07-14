import view from '../view';
import storyBehaviour from '../../constants/storyBehaviour';

import { Events, Subtitles, Video } from '../Components';
import { parseFile } from '../tools/fileParsers';
import state from '../state';

export class Scene {
	constructor(options) {
		this.longName = options.longName;
		this.video = new Video(options.video);
		this.events = new Events(options.events);

		this.mountComponents(this.video, this.events);

		if (storyBehaviour.subtitles.active) {
			// TODO Create abstraction here
			parseFile(options.video.subtitles[state.language])
				.then(subtitles => {
					this.subtitles = new Subtitles(subtitles);
					this.mountComponents(this.subtitles);
				})
				.catch(error => {
					console.warn(error);
				});
		}
	}

	mountComponents(...components) {
		components.forEach(component => view.containers.stage.attach(component));
	}
}
