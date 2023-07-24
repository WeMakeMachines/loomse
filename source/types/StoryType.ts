export interface StoryType {
	shortName?: string;
	longName?: string;
	author?: string;
	description?: string;
	firstScene: string;
	language?: string;
	scenes: StoryScenes;
}

type SceneName = string;

export interface StoryScenes {
	[key: SceneName]: StoryScene;
}

export interface StoryScene {
	longName?: string;
	video: StoryVideo;
	events: StoryEvent[];
}

export interface StoryVideo {
	sources: {
		mp4?: string;
		ogg?: string;
		webm?: string;
	};
	autoplay?: boolean;
	controls?: boolean;
	loop?:
		| {
				in: number;
				out: number;
		  }
		| boolean;
	muted?: boolean;
	subtitles?: string;
}

export interface StoryEvent {
	pluginName?: string;
	in: number;
	out: number;
	payload?: object;
}
