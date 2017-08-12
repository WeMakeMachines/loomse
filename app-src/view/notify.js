/**
 * Handles all user friendly notifications
 *
 */

import { element } from '../tools/common';

let parentElement = element.create({ id: 'loading' });

const loading = {
	parentElement
};

export { loading as default };