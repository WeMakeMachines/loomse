/**
 * Progress loading bar
 *
 */

import { element } from '../tools/common';

let parentElement = element.create({ id: 'loading' });

const loading = {
	parentElement
};

export { loading as default };