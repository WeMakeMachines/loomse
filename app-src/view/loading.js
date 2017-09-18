/**
 * Progress loading bar
 *
 */

import { element } from '../tools/common';
import notify from './notify';
import loadingHtml from '../templates/loading.html';

// const progressBar = {
// 	value  : 0,
// 	max    : 5,
// 	element: null,
// 	initialise: () => {
// 		this.element = element.create({ type: progress, class: 'loading' });
// 		element.attributes(this.element, {
// 			max  : this.max,
// 			value: this.value
// 		});
// 	},
// 	update : (value) => {
// 		this.value = this.value + value;
//
// 		if(this.value >= this.max) {
// 			this.completed();
// 		} else {
// 			element.attributes(this.element, {
// 				value: this.value
// 			});
// 		}
// 	},
// 	completed: function() {
//
// 	}
// };

const loading = {
	initialise: function() {

		console.log('wrking');

		//console.log(loadingHtml);

		//let html = `{$loadingHtml}`;

		// notify.splash({
		// 	html: loadingHtml
		// });
	}
};

export { loading as default };