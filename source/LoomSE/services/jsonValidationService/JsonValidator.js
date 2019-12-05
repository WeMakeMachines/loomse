import Djv from 'djv';

class JsonValidator {
	constructor(schema) {
		this.schema = schema;
	}

	validate(jsonData) {
		const djv = new Djv();

		djv.addSchema('script', this.schema);

		const output = djv.validate('script', jsonData);

		return !Boolean(output);
	}
}

export default JsonValidator;
