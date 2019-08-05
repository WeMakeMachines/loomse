import scriptSchema from '../../schemas/script';
import Djv from 'djv';
import { ajaxRequest } from '../../tools/common';

class ScriptReaderError extends Error {}

export class ScriptReader {
	constructor(schema = scriptSchema) {
		this.schema = schema;
	}

	loadFromUri(uri) {
		return new Promise(resolve => {
			ajaxRequest(uri, 'JSON')
				.then(jsonData => resolve(jsonData))
				.catch(error => {
					throw new ScriptReaderError(`Unable to read script, ${error}`);
				});
		});
	}

	validate(jsonData) {
		const djv = new Djv();

		djv.addSchema('script', this.schema);

		const output = djv.validate('script', jsonData);

		if (!output) {
			return true;
		}

		throw new ScriptReaderError(
			`Script error, does not match schema, ${JSON.stringify(output)}`
		);
	}
}
