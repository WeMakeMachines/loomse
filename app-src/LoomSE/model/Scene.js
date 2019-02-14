import view from '../view';

import { Events, Subtitles, Video } from '../Components';

export class Scene {

    constructor(options) {
        this.longName = options.longName;
        this.video = new Video(options.video);
        this.events = new Events(options.events);
        this.subtitles = new Subtitles(options.video.subtitles);

        this.mountComponents();
    }

    mountComponents() {
        view.containers.stage.attach(this.video);
        view.containers.stage.attach(this.events);
        view.containers.stage.attach(this.subtitles);
    }
}
