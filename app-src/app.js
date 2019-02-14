import LoomSE from './LoomSE';

import { browser } from './services';

import config from './configs/config';

import { initialiseView } from './LoomSE/view';
import { initialiseRadio } from './services';

export default function(node) {

	initialiseView(node);
	initialiseRadio(node);

	const loomSE = new LoomSE({
		lastState: browser.localStorage.getData(),
		isClientSupported: browser.isCompatible()
	});

	return {
		...loomSE.api,
		v: config.version,
		version: config.version
	};
};
