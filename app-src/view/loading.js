/**
 * Progress loading bar
 */
import html from '../templates/loading.html';
import popup from './popup';

const loading = {

	initialise() {
		popup.splash({
			html
		});
	},

	stop() {
		popup.wipe();
	}
};

export { loading as default };