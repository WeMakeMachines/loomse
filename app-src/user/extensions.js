/**
 * User defined function space
 */

import loomSE from '../base';

const userDefinedModules = {

	test: function() {

		return {
			run: function() {
				console.log('firing!');
				console.log(loomSE.currentTime());
			},
			stop: function() {
				console.log('closing!');
			}
		};
	}

};

export { userDefinedModules as default };