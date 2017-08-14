/**
 * Handles all user friendly notifications
 *
 */

import { element } from '../tools/common';

const SETUP = {
	id: 'notify'
};

let parentElement = element.create({ id: SETUP.id });

const loading = {
	parentElement
};

export { loading as default };