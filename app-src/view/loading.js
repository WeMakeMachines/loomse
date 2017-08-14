/**
 * Progress loading bar
 *
 */

import { element } from '../tools/common';

const SETUP = {
	id: 'loading'
};

let parentElement = element.create({ id: SETUP.id });

const loading = {
	parentElement
};

export { loading as default };