import EventQueue from '../EventQueue';
import { ScriptedEvent } from '../../../types/scriptedStory';

const mockTimedObjects: ScriptedEvent[] = [
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
	let eventQueue: EventQueue;

	beforeEach(() => {
		eventQueue = new EventQueue(mockTimedObjects);
	});

	describe('pending getter', () => {
		test('should return the next item in the queue to be the first item in the queue, if the index is 0', () => {
			eventQueue.index = 0;

			const actual = eventQueue.pending;
			const expected = { id: 0, time: 0, action: 'start' };

			expect(actual).toEqual(expected);
		});

		test('should return the second item in the queue to be the first item in the queue, if the index is 1', () => {
			eventQueue.index = 1;

			const actual = eventQueue.pending;
			const expected = { id: 0, time: 2000, action: 'stop' };

			expect(actual).toEqual(expected);
		});
	});

	describe('getTimedObject method', () => {
		test('should return the original input object from the array', () => {
			const index = 0;
			const actual = eventQueue.getTimedObject(index);
			const expected = mockTimedObjects[index];

			expect(actual).toEqual(expected);
		});
	});

	describe('advance method', () => {
		test('should increase the queue size by +1', () => {
			eventQueue.index = 0;
			eventQueue.advance();

			const actual = eventQueue.index;
			const expected = 1;

			expect(actual).toEqual(expected);
		});
	});

	describe('build method', () => {
		test('should return a processed queue from the input, generating 2 objects per input', () => {
			const actual = eventQueue.build();
			const expected = [
				{ id: 0, time: 0, action: 'start' },
				{ id: 0, time: 2000, action: 'stop' },
				{ id: 1, time: 3000, action: 'start' },
				{ id: 1, time: 4000, action: 'stop' }
			];

			expect(actual).toEqual(expected);
		});
	});

	describe('sort method', () => {
		test('should sort the queue ascending on the time property when the argument "asc" is passed', () => {
			eventQueue.sort('asc');

			const actual = eventQueue.queue;
			const expected = [
				{ id: 0, time: 0, action: 'start' },
				{ id: 0, time: 2000, action: 'stop' },
				{ id: 1, time: 3000, action: 'start' },
				{ id: 1, time: 4000, action: 'stop' }
			];

			expect(actual).toEqual(expected);
		});

		test('should sort the queue descending on the time property when the argument "desc" is passed', () => {
			eventQueue.sort('desc');

			const actual = eventQueue.queue;
			const expected = [
				{ id: 1, time: 4000, action: 'stop' },
				{ id: 1, time: 3000, action: 'start' },
				{ id: 0, time: 2000, action: 'stop' },
				{ id: 0, time: 0, action: 'start' }
			];

			expect(actual).toEqual(expected);
		});
	});
});
