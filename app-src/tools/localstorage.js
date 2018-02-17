const STORAGE_KEY = 'data';

let data = {};
let isAvailable = false;

/**
 * @returns {boolean}
 */
function checkIsAvailable() {
	try {
		isAvailable = true;
		return Boolean(window.localStorage);
	}
	catch (error) {
		throw 'Unable to save state to localStorage';
	}
}

/**
 * @returns {object}
 */
function getData() {
	if (!isAvailable) { return; }

	let readFromStorage = window.localStorage.getItem(STORAGE_KEY);

	if (!readFromStorage) { return; }

	data = JSON.parse(readFromStorage);
	return data;
}

/**
 * @param {string} key
 * @param {*} value
 */
function saveData(key, value) {
	if (!isAvailable) { return; }

	if (!data[key]) {
		data[key] = [];
	}

	data[key].push(value);

	let saveToStorage = JSON.stringify(data);

	try {
		window.localStorage.setItem(STORAGE_KEY, saveToStorage);
	}
	catch (error) {
		throw `Unable to save to localStorage ${error}`;
	}
}

const localStorage = {

	returnState() {
		if (checkIsAvailable()) {
			return getData();
		}
	},
	saveData
};

export { localStorage as default };
