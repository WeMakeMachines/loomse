import { browser } from '../../services';

import { ajaxRequest } from '../tools';

import config from '../config';
import scriptSchema from '../schemas/script';

import state from '../state';

import Djv from 'djv';

class ScriptError extends Error {}

// TODO Abstract script logic into own class

export class Story {
	/**
	 * Determines the appropriate source of the script (mobile or desktop)
	 * @returns {string}
	 */
	static getScriptFile() {

		if(!config.script) {
			throw new ScriptError('No script file to load from');
		}

		return (config.mobileScript && browser.hasSmallScreen())
			? config.mobileScript
			: config.script;
	}

	constructor(schema = scriptSchema) {
		this.scriptFile = this.constructor.getScriptFile();
		this.schema = schema;
		this.shortName = '';
		this.longName = '';
		this.author = '';
		this.description = '';
		this.firstScene = '';
		this.scenes = {};
		this.language = '';
	}

	load() {
		return new Promise(resolve => {
			this.fetchScript()
				.then(jsonData => {
					const validation = this.validateScript(jsonData);

					if (!validation.isValid) {
						throw new ScriptError(
							`Script error, does not match schema, ${JSON.stringify(
								validation.reason
							)}`
						);
					}

					this.shortName = jsonData.shortName;
					this.longName = jsonData.longName;
					this.author = jsonData.author;
					this.description = jsonData.description;
					this.firstScene = jsonData.firstScene;
					this.scenes = jsonData.scenes;
					this.language = jsonData.language;

					this.updateState();

					resolve();
				})
				.catch(error => {
					throw new ScriptError(`Unable to read script, ${error}`);
				});
		});
	}

	validateScript(jsonData) {
		const djv = new Djv();

		djv.addSchema('script', this.schema);

		const output = djv.validate('script', jsonData);

		if (!output) {
			return {
				isValid: true
			};
		}

		return {
			isValid: false,
			reason: output
		};
	}

	fetchScript() {
		return ajaxRequest(this.scriptFile, 'JSON');
	}

	updateState() {
		state.language = this.language;
	}
}
