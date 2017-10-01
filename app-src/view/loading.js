/**
 * Progress loading bar
 *
 */

import loadingHtml from '../templates/loading.html';
import notify from './notify';

const loading = {
	initialise: () => {
		notify.splash({
			html: loadingHtml
		});
	},

	stop: () => {
		notify.wipe();
	}
};

export { loading as default };