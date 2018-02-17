/**
 * Progress loading bar
 */
import html from '../html/loading.html';
import popup from './components/popup/popup';

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
