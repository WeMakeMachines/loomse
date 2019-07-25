import appConfig from '../../appConfig';

import { ScriptReader } from './ScriptReader';

import state from '../../state';

import { browser } from '../../../lib';

class StoryError extends Error {}

export class Story {
	constructor(config = appConfig) {
		this.scriptReader = new ScriptReader(this.getScriptUri(config));
		this.script = {};
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
	 * @returns {string}
	 */
	getScriptUri(config) {
		if (!config['script']) {
			throw new StoryError('No script file to load');
		}

		return config['mobileScript'] && browser.hasSmallScreen()
			? config['mobileScript']
			: config['script'];
	}

	async readScript() {
		this.script = await this.scriptReader.load();

		const isScriptValid = this.scriptReader.validate(this.script);

		if (!isScriptValid) {
			throw new StoryError('Unable to continue');
		}

		this.parseScriptParameters(this.script);
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
