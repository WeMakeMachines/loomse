import EventQueue from '../EventQueue';

const mockTimedObjects = [
	{
		in: 0,
		out: 2000
	},
	{
		in: 3000,
		out: 4000
	}
];

describe('Queue', () => {
	let queue;

	beforeEach(() => {
		queue = new EventQueue(mockTimedObjects);
	});

	describe('pending getter', () => {
		test('should return the next item in the queue to be the first item in the queue, if the index is 0', () => {
			queue.index = 0;

			const actual = queue.pending;
			const expected = { id: 0, time: 0, action: 'run' };

			expect(actual).toEqual(expected);
		});

		test('should return the second item in the queue to be the first item in the queue, if the index is 1', () => {
			queue.index = 1;

			const actual = queue.pending;
			const expected = { id: 0, time: 2000, action: 'stop' };

			expect(actual).toEqual(expected);
		});
	});

	describe('getTimedObject method', () => {
		test('should return the original input object from the array', () => {
			const index = 0;
			const actual = queue.getTimedObject(index);
			const expected = mockTimedObjects[index];

			expect(actual).toEqual(expected);
		});
	});

	describe('advance method', () => {
		test('should increase the queue size by +1', () => {
			queue.index = 0;
			queue.advance();

			const actual = queue.index;
			const expected = 1;

			expect(actual).toEqual(expected);
		});
	});

	describe('build method', () => {
		test('should return a processed queue from the input, generating 2 objects per input', () => {
			const actual = queue.build();
			const expected = [
				{ id: 0, time: 0, action: 'run' },
				{ id: 0, time: 2000, action: 'stop' },
				{ id: 1, time: 3000, action: 'run' },
				{ id: 1, time: 4000, action: 'stop' }
			];

			expect(actual).toEqual(expected);
		});
	});

	describe('sort method', () => {
		test('should sort the queue ascending on the time property when the argument "asc" is passed', () => {
			queue.sort('asc');

			const actual = queue.queue;
			const expected = [
				{ id: 0, time: 0, action: 'run' },
				{ id: 0, time: 2000, action: 'stop' },
				{ id: 1, time: 3000, action: 'run' },
				{ id: 1, time: 4000, action: 'stop' }
			];

			expect(actual).toEqual(expected);
		});

		test('should sort the queue descending on the time property when the argument "desc" is passed', () => {
			queue.sort('desc');

			const actual = queue.queue;
			const expected = [
				{ id: 1, time: 4000, action: 'stop' },
				{ id: 1, time: 3000, action: 'run' },
				{ id: 0, time: 2000, action: 'stop' },
				{ id: 0, time: 0, action: 'run' }
			];

			expect(actual).toEqual(expected);
		});
	});
});
