/**
 * User defined function space
 */
import loomSE from '../base';

const userDefinedModules = {

	test() {

		return {
			run(element, render) {
				console.log('element', element);
				console.log('this', this);
				console.log('firing!');
				console.log(loomSE.currentTime());
				element.innerHTML = '<p>It works!</p>';

				render();
			},

			stop() {
				console.log('closing!');
			}
		};
	}

};

export { userDefinedModules as default };