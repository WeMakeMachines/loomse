import {newObject} from '../tools/common';

let parentElement = newObject('div', { id: 'loading' });

const loading = {
	parentElement: parentElement
};

export { loading as default };