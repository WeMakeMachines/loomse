/**
 * Derived from /schemas/script.json
 */

import { Event } from '../services/eventService/EventQueue';

export interface ScriptedStory {
	shortName?: string;
	longName?: string;
	author?: string;
	description?: string;
	firstScene: string;
	language?: string;
	scenes: ScriptedScenes;
}

export interface ScriptedScenes {
	[key: string]: ScriptedScene;
}

export interface ScriptedScene {
	longName?: string;
	video: ScriptedVideo;
	events: Event[];
}

export interface ScriptedVideo {
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
