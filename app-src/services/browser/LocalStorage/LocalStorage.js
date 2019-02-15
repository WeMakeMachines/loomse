class LocalStorageError extends Error {
	constructor(message) {
		super(message);
	}
}

export class LocalStorage {

	constructor(ref = window) {
		this.ref = ref;
		this.storageKey = 'data';
		this.data = {};
		this.isAvailable = this.checkIsAvailable();
	}

	checkIsAvailable() {
		const testKey = 'test';

		try {
			this.isAvailable = true;
			this.ref.localStorage.setItem(testKey, {});
			this.ref.localStorage.removeItem(testKey);
			return true;
		}
		catch (error) {
			throw new LocalStorageError(`Unable to access local storage, ${error}`);
		}
	}

	getData() {
		if (!this.isAvailable) { return; }

		const readFromStorage = this.ref.localStorage.getItem(this.storageKey);

		if (!readFromStorage) { return; }

		this.data = JSON.parse(readFromStorage);

		return this.data;
	}

	saveData(key, value) {
		if (!this.isAvailable) { return; }

		if (!this.data[key]) {
			this.data[key] = [];
		}

		this.data[key].push(value);

		const saveToStorage = JSON.stringify(this.data);

		try {
			this.ref.localStorage.setItem(this.storageKey, saveToStorage);
		}
		catch (error) {
			throw new LocalStorageError(`Unable to access local storage, ${error}`);
		}
	}
}
