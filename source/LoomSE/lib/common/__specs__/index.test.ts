import { isEmptyObject } from '../';

describe('Common tools', () => {
	describe('isEmptyObject', () => {
		test('it should return false if the object is not empty', () => {
			const object = {
				text: ''
			};
			const actual = isEmptyObject(object);

			expect(actual).toEqual(false);
		});

		test('it should return true if the object is empty', () => {
			const object = {};
			const actual = isEmptyObject(object);

			expect(actual).toEqual(true);
		});
	});
});
