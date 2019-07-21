import config from '../config';

class ModulesError extends Error {}

class Modules {
	constructor() {
		if (!config.modulesGlobalReference) {
			return;
		}

		this.reference = window[config.modulesGlobalReference];

		if (!this.reference) {
			throw new ModulesError('No modules found');
		}
	}

	getModule(moduleReference) {
		if (!this.reference || !this.reference[moduleReference]) {
			return;
		}

		return this.reference[moduleReference];
	}
}

export const modules = new Modules();
