import { StoryType, StoryScenes } from '../../types/StoryType';

export default class Story implements StoryType {
	public firstScene: string;
	public scenes: StoryScenes;
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
	}: Story) {
		this.firstScene = firstScene;
		this.scenes = scenes;
		this.shortName = shortName;
		this.longName = longName;
		this.author = author;
		this.description = description;
		this.language = language;
	}
}
