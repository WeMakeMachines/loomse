import view from '../view';
import config from '../config';

import { Events, Subtitles, Video } from '../Components';
import { parseFile } from '../tools/fileParsers';
import { browser } from '../../lib';
import state from '../state';

export class Scene {
	constructor(options) {
		this.longName = options.longName;
		this.video = new Video(options.video);
		this.events = new Events(this.parseEvents(options.events));

		this.mountComponents(this.video, this.events);

		if (config.subtitles.active) {
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
			const module = browser.getExternalModule(event['moduleName']);

			if (module) {
				event.module = module;
			}

			return event;
		});
	}

	mountComponents(...components) {
		components.forEach(component => view.containers.stage.attach(component));
	}

	unmountComponents() {
		// TODO handle this better, remove radio events for subtitles
		this.video.stopListeningToRadio();
		this.events.stopListeningToRadio();

		view.containers.stage.removeChildren();
	}
}
