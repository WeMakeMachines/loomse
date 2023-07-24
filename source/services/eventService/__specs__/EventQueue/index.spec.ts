import { StoryEvent } from '../../../../types/StoryType';
import EventQueue, { EventAction, TimedObject } from '../../EventQueue';

const mockScriptedEvents: StoryEvent[] = [
	{
		in: 0,
		out: 2000
	},
	{
		in: 3000,
		out: 4000
	}
];

const sortedMockTimedObjects: TimedObject[] = [
	{ id: 0, time: 0, action: EventAction.START },
	{ id: 0, time: 2000, action: EventAction.STOP },
	{ id: 1, time: 3000, action: EventAction.START },
	{ id: 1, time: 4000, action: EventAction.STOP }
];

const unSortedMockTimedObjects: TimedObject[] = [
	{ id: 1, time: 3000, action: EventAction.START },
	{ id: 0, time: 2000, action: EventAction.STOP },
	{ id: 1, time: 4000, action: EventAction.STOP },
	{ id: 0, time: 0, action: EventAction.START }
];

describe('EventQueue', () => {
	let eventQueue: EventQueue;

	beforeEach(() => {
		eventQueue = new EventQueue();
	});

	describe('buildQueueFromScriptedEvents static method', () => {
		test('should return a processed queue from the input, generating 2 objects per input', () => {
			const actual =
				EventQueue.buildQueueFromScriptedEvents(mockScriptedEvents);
			const expected = [
				{ id: 0, time: 0, action: EventAction.START },
				{ id: 0, time: 2000, action: EventAction.STOP },
				{ id: 1, time: 3000, action: EventAction.START },
				{ id: 1, time: 4000, action: EventAction.STOP }
			];

			expect(actual).toEqual(expected);
		});
	});

	describe('setQueue method', () => {
		test('should reset queueIndex to 0', () => {
			eventQueue['queueIndex'] = 4;
			eventQueue.setQueue(sortedMockTimedObjects);

			const actual = eventQueue['queueIndex'];

			expect(actual).toEqual(0);
		});

		test('should set the internal queue state to the new queue', () => {
			eventQueue.setQueue(sortedMockTimedObjects);

			const actual = eventQueue['queue'];

			expect(actual).toEqual(sortedMockTimedObjects);
		});

		test('should sort the new queue', () => {
			eventQueue.setQueue(unSortedMockTimedObjects);

			const actual = eventQueue['queue'];

			expect(actual).toEqual(sortedMockTimedObjects);
		});
	});

	describe('getQueue method', () => {
		test('should return the queue', () => {
			eventQueue['queue'] = sortedMockTimedObjects;

			const actual = eventQueue.getQueue();

			expect(actual).toEqual(sortedMockTimedObjects);
		});
	});

	describe('getCurrentTimedEventId method', () => {
		test('should return the id property of the current item in the queue', () => {
			eventQueue['queue'] = sortedMockTimedObjects;
			eventQueue['queueIndex'] = 2;

			const actual = eventQueue.getCurrentTimedEventId();

			expect(actual).toEqual(sortedMockTimedObjects[2].id);
		});
	});

	describe('getPendingObject method', () => {
		test('should return the first item in the queue, if the getCurrentEventId is 0', () => {
			eventQueue['queue'] = sortedMockTimedObjects;
			const actual = eventQueue.getPendingObject();
			const expected = { id: 0, time: 0, action: 'start' };

			expect(actual).toEqual(expected);
		});

		test('should return the second item in the queue, if the index is 1', () => {
			eventQueue['queue'] = sortedMockTimedObjects;
			eventQueue['queueIndex'] = 1;

			const actual = eventQueue.getPendingObject();
			const expected = { id: 0, time: 2000, action: 'stop' };

			expect(actual).toEqual(expected);
		});

		test('should return undefined if the queueIndex is invalid', () => {
			eventQueue['queue'] = sortedMockTimedObjects;
			eventQueue['queueIndex'] = 10;

			const actual = eventQueue.getPendingObject();

			expect(actual).toBeUndefined();
		});
	});

	describe('advanceQueue method', () => {
		test('should increase the queue size by +1', () => {
			eventQueue.advanceQueue();

			const actual = eventQueue['queueIndex'];
			const expected = 1;

			expect(actual).toEqual(expected);
		});
	});

	describe('sort method', () => {
		test('should sort the queue ascending on the time property when the argument "asc" is passed', () => {
			eventQueue['queue'] = unSortedMockTimedObjects;
			eventQueue.sort('asc');

			const actual = eventQueue['queue'];
			const expected = [
				{ id: 0, time: 0, action: 'start' },
				{ id: 0, time: 2000, action: 'stop' },
				{ id: 1, time: 3000, action: 'start' },
				{ id: 1, time: 4000, action: 'stop' }
			];

			expect(actual).toEqual(expected);
		});

		test('should sort the queue descending on the time property when the argument "desc" is passed', () => {
			eventQueue['queue'] = unSortedMockTimedObjects;
			eventQueue.sort('desc');

			const actual = eventQueue.getQueue();
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
