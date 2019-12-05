import JsonValidator from './JsonValidator';

export const jsonValidatorService = (json, schema) => {
	const jsonValidator = new JsonValidator(schema);
	const isValid = jsonValidator.validate(json);

	if (!isValid) {
		return Promise.reject('JSON does not match the schema');
	}

	return Promise.resolve();
};
