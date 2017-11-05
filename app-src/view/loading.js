/**
 * Progress loading bar
 */
import html from '../templates/loading.html';
import notify from './notify';

const loading = {

	initialise() {
		notify.splash({
			html
		});
	},

	stop() {
		notify.wipe();
	}
};

export { loading as default };