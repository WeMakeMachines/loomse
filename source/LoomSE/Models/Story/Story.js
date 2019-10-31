import appConfig from '../../appConfig';

import { ScriptReader } from './ScriptReader';

import state from '../../state';

import { isEmptyObject } from '../../tools/common';

import { hasSmallScreen } from '../../lib/browser';

class StoryError extends Error {}

export class Story {
	constructor(config = appConfig) {
		this.hasSmallScreen = hasSmallScreen(config.mobileMinimumResolution);
		this.scriptJson = config.script || {};
		this.mobileScriptJson = config.mobileScriptJson || {};
		this.scriptUri = config.scriptUri;
		this.mobileScriptUri = config.mobileScriptUri;
		this.scriptReader = new ScriptReader();
		this.json = {};
		this.shortName = '';
		this.longName = '';
		this.author = '';
		this.description = '';
		this.firstScene = '';
		this.scenes = {};
		this.language = '';
	}

	/**
	 * Determines the appropriate source of the script (mobile or desktop)
	 * @returns {JSON}
	 */
	getJson() {
		if (this.hasSmallScreen && isEmptyObject(this.mobileScriptJson)) {
			return this.scriptReader.loadFromUri(this.mobileScriptUri);
		} else if (this.hasSmallScreen) {
			return this.mobileScriptJson;
		}

		if (isEmptyObject(this.scriptJson)) {
			return this.scriptReader.loadFromUri(this.scriptUri);
		}

		return this.scriptJson;
	}

	async readScript() {
		this.json = await this.getJson();

		const isScriptValid = this.scriptReader.validate(this.json);

		if (!isScriptValid) {
			throw new StoryError('Unable to continue');
		}

		this.parseScriptParameters(this.json);
	}

	parseScriptParameters(scriptParameters) {
		this.shortName = scriptParameters.shortName;
		this.longName = scriptParameters.longName;
		this.author = scriptParameters.author;
		this.description = scriptParameters.description;
		this.firstScene = scriptParameters.firstScene;
		this.scenes = scriptParameters.scenes;
		this.language = scriptParameters.language;

		this.updateState();
	}

	updateState() {
		state.language = this.language;
	}
}
