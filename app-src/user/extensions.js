/**
 * User defined function space
 */

import loomSE from '../base';

const userDefinedModules = {

	test: () => {

		return {
			run: (element) => {
				console.log('firing!');
				console.log(loomSE.currentTime());
			},
			stop: () => {
				console.log('closing!');
			}
		};
	}

};

export { userDefinedModules as default };