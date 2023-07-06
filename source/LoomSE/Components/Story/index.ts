import { ScriptedStory, ScriptedScenes } from '../../types/scriptedStory';

export default class Story implements ScriptedStory {
	public firstScene: string;
	public scenes: ScriptedScenes;
	public author?: string;
	public shortName?: string;
	public longName?: string;
	public description?: string;
	public language?: string;

	constructor({
		firstScene,
		scenes,
		author,
		shortName,
		longName,
		description,
		language
	}: ScriptedStory) {
		this.firstScene = firstScene;
		this.scenes = scenes;
		this.shortName = shortName;
		this.longName = longName;
		this.author = author;
		this.description = description;
		this.language = language;
	}
}
