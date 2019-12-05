class Story {
	constructor({
		shortName,
		longName,
		author,
		description,
		firstScene,
		language,
		scenes
	}) {
		this.shortName = shortName;
		this.longName = longName;
		this.author = author;
		this.description = description;
		this.firstScene = firstScene;
		this.scenes = scenes;
		this.language = language;
	}
}

export default Story;
