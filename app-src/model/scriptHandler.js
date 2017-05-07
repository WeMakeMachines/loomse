/**
 * Handles the script logic;
 * a collection of methods that set and process
 * the media elements in the Script
 *
 */

import { cleanString, report } from '../tools/common';
import config from '../config';
import { newObject } from '../tools/common';
import data from './data';
import events from './events';
import media from '../view/media';
import subtitles from '../view/subtitles';
import view from '../view/controller';

const scriptHandler = (function () {

	/**
	 * Constructor function that creates instances of each scene
	 *
	 * @param {Object} scene
	 */
	class Scene {
		constructor (title, language, assets) {
			this.title = title;
			this.shortName = assets.short_name;
			this.longName = assets.long_name;
			this.sceneId = cleanString(this.title);
			this.media = assets.media;
			this.subtitles = assets.media.subtitles[language];
			this.events = assets.events;
		}
	}

	/**
	 * Sets the scene
	 * Runs when a new scene is set from the Script
	 * Pulls the relevant scene details from the object,
	 * resets parameters and launches the process() method.
	 *
	 * @param {Object} scriptObject
	 * @param {Object} scene
	 */
	function setScene(scriptObject, scene) {
		data.currentScene = new Scene(scene, config.behaviour.settings.language, scriptObject.scenes[scene]);

		//check if subtitles should be on
		// if (config.behaviour.settings.subtitles === true) {
		// 	subtitles.on();
		// } else {
		// 	subtitles.off();
		// }
		// subtitles.parse(data.currentScene.subtitles);

		//history.record(data.currentScene); // disabled for now
	}

	// Constructor function that creates instances of each scene
	// let Scene = function (title, language, assets) {
	// 	let that = this;
	// 	this.title = title;
	// 	this.shortName = assets.short_name;
	// 	this.longName = assets.long_name;
	// 	this.sceneId = cleanString(this.title);
	// 	this.media = assets.media;
	// 	this.subtitles = assets.media.subtitles[language];
	// 	this.events = assets.events;
	// 	this.container = (function () {
	// 		let element = document.createElement('div');
	// 		element.setAttribute('id', that.sceneId);
	// 		element.media = that.media.type;
	// 		return element;
	// 	}());
	// };

	/**
	 * Processes the current scene
	 * Each scene is composed of a 'media' type, which in turn has 'data' and 'parameters'
	 * Each 'media' type also has a number of events.js
	 *
	 * @param {Object} scene
	 */
	function process(scene) {

		media.initialise(scene.media, (mediaObject) => {
			media.play();
		});

		// media.create(scene.container, scene.media, function (playObject) {
		//
		// 	media.object = playObject;
		// 	// check which media needs to play
		// 	// play video
		// 	if (scene.media.type === 'video') { // TODO need to allow this to accept and process multiple strings
		// 		scene.media.video.duration = playObject.duration;
		//
		// 		// check if video SHOULD autoplay
		// 		if (media.object.loomSE_parameters.autoplay === true) {
		// 			media.play();
		// 			view.resolution.video.height = media.object.videoHeight;
		// 			view.resolution.video.height = media.object.videoWidth;
		// 		}
		//
		// 		//if(playObject.loop === false && (scene.data.nextSceneByDefault !== null || scene.data.nextnextSceneByDefault !== '')){
		// 		//    playObject.onended = function(e){
		// 		//        readScript.setScene(scene.data.nextSceneByDefault);
		// 		//    };
		// 		//}
		//
		// 		// video loop logic must stay here
		//
		// 		if (media.object.loomSE_parameters.loop === true) {
		// 			if (media.object.loomSE_parameters.loopIn === 0 && media.object.loomSE_parameters.loopOut === null) {
		// 				media.object.onended = function (e) {
		// 					report('Looping from end to beginning');
		// 					view.reset();
		// 					events.reset();
		// 					media.play(0);
		// 				};
		// 			} else {
		// 				report('Im going to loop the video from the in and out points defined');
		// 				// add loop point as event
		// 				// for the purposes of our system, in / out points are reversed
		// 				// (schedule in point is actually loop out point etc)
		// 				data.currentScene.events.push(
		// 					{
		// 						call    : 'loop',
		// 						schedule: {
		// 							in : media.object.loomSE_parameters.loopOut,
		// 							out: media.object.loomSE_parameters.loopIn
		// 						}
		// 					}
		// 				);
		// 			}
		// 		}
		// 	}
		//
		// 	if (scene.events !== null) {
		// 		events.schedule(media.object, scene.events, function () {
		// 		});
		// 	} else {
		// 		report('[Events] No events.js in scene.');
		// 	}
		// });
	}

	return {
		initialise: function(script) {
			setScene(script, config.firstScene);
			process(data.currentScene);
		}
	};
}());

export default scriptHandler;
