/**
 * Handles the script logic;
 * a collection of methods that set and process
 * the media elements in the Script
 */
import { cleanString } from '../tools/common';
import data from './data';

/**
 * Scene class
 */
class Scene {

	/**
	 * @param {string} title
	 * @param {object} assets
	 */
	constructor (title, assets) {
		this.title = title;
		this.shortName = assets.short_name;
		this.longName = assets.long_name;
		this.sceneId = cleanString(this.title);
		this.media = assets.media;
		this.events = assets.events;
	}
}

/**
 * Sets the scene
 * Runs when a new scene is set from the Script
 * Pulls the relevant scene details from the object,
 * resets parameters and launches the process() method.
 *
 * @param {object} scene
 */
function setScene(scene) {
	let checkForPreviousScene = !(data.currentScene === null);

	if (checkForPreviousScene) {
		data.sceneHistory.push(data.currentScene);
	}

	data.currentScene = new Scene(scene, data.script.scenes[scene]);
}

const scriptHandler = {

	/**
	 * Initialises scene
	 * @param {string} scene - named scene
	 */
	initialise: (scene) => {
		setScene(scene);
		//process(data.currentScene);
	}
};

export { scriptHandler as default };