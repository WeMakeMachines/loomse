import view from '../view';
import storyBehaviour from '../../constants/storyBehaviour';
import * as userDefinedModules from '../user/userModules';

import { Events, Subtitles, Video } from '../Components';
import { parseFile } from '../tools/fileParsers';
import state from '../state';

export class Scene {
	constructor(options) {
		this.longName = options.longName;
		this.video = new Video(options.video);
		this.events = new Events(this.parseEvents(options.events));

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

	parseEvents(events) {
		return events.map(event => {
			const module = userDefinedModules[event['moduleName']];

			if (module) {
				event.module = module;
			}

			return event;
		});
	}

	mountComponents(...components) {
		components.forEach(component => view.containers.stage.attach(component));
	}
}
