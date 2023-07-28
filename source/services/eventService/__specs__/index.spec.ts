import 'reflect-metadata';
import { container, singleton } from 'tsyringe';

import { SceneEvent } from '../../../types/StoryType';
import EventService from '../index';
import EventQueue, { EventAction, TimedObject } from '../EventQueue';

jest.mock('../EventQueue');

const mockEvents_1: SceneEvent[] = [
	{
		pluginName: 'test-plugin-1',
		in: 0,
		out: 10,
		payload: {
			sample: 'Sample'
		}
	},
	{
		pluginName: 'test-plugin-2',
		in: 11,
		out: 15,
		payload: {
			sample: 'Sample'
		}
	}
];

const mockEvents_2: SceneEvent[] = [
	{
		pluginName: 'test-plugin-1',
		in: 2,
		out: 3,
		payload: {
			sample: 'Sample'
		}
	},
	{
		pluginName: 'test-plugin-2',
		in: 5,
		out: 6,
		payload: {
			sample: 'Sample'
		}
	}
];

const mockEvents_1_EventQueue = [
	{
		id: 0,
		time: 0,
		action: EventAction.START
	},
	{
		id: 0,
		time: 10,
		action: EventAction.STOP
	},
	{
		id: 1,
		time: 11,
		action: EventAction.START
	},
	{
		id: 1,
		time: 15,
		action: EventAction.STOP
	}
];

@singleton()
class MockEventService extends EventService {
	constructor() {
		super(container.resolve(EventQueue));
	}
	public startEventCallback() {}

	public stopEventCallback() {}

	public setEvents(events: SceneEvent[]) {
		super.setEvents(events);
	}
}

describe('EventService', () => {
	let mockEventService: MockEventService;

	beforeEach(() => {
		container.clearInstances();
		mockEventService = container.resolve(MockEventService);
	});

	describe('public method setEvents', () => {
		test('should set the events to the new event list', () => {
			mockEventService.setEvents(mockEvents_1);

			const events = mockEventService['events'];

			expect(events).toEqual(mockEvents_1);
		});

		test('should set a new list, replacing the old one', () => {
			mockEventService.setEvents(mockEvents_1);
			mockEventService.setEvents(mockEvents_2);

			const events = mockEventService['events'];

			expect(events).toEqual(mockEvents_2);
		});
	});

	describe('getCurrentlyActionableEvent', () => {
		test('should return undefined if the timecode does not match the pending event', () => {
			mockEventService['events'] = mockEvents_1;

			const MockEventQueue = EventQueue as jest.MockedClass<
				typeof EventQueue
			>;

			MockEventQueue.prototype.getPendingObject.mockImplementation(
				(): TimedObject => {
					return mockEvents_1_EventQueue[2];
				}
			);

			MockEventQueue.prototype.getCurrentTimedEventId.mockImplementation(
				() => {
					return 1; // the original event id
				}
			);

			const result = mockEventService['getCurrentlyActionableEvent'](10);

			expect(result).toBeUndefined();
		});

		test('should return the pending event when the timecode matches the pending event', () => {
			mockEventService['events'] = mockEvents_1;

			const MockEventQueue = EventQueue as jest.MockedClass<
				typeof EventQueue
			>;

			MockEventQueue.prototype.getPendingObject.mockImplementation(
				(): TimedObject => {
					return mockEvents_1_EventQueue[2];
				}
			);

			MockEventQueue.prototype.getCurrentTimedEventId.mockImplementation(
				() => {
					return 1; // the original event id
				}
			);

			const result = mockEventService['getCurrentlyActionableEvent'](11);

			expect(result).toEqual({
				event: mockEvents_1[1],
				action: EventAction.START
			});
		});

		test('should return the pending event the timecode is greater than the pending event', () => {
			mockEventService['events'] = mockEvents_1;

			const MockEventQueue = EventQueue as jest.MockedClass<
				typeof EventQueue
			>;

			MockEventQueue.prototype.getPendingObject.mockImplementation(
				(): TimedObject => {
					return mockEvents_1_EventQueue[2];
				}
			);

			MockEventQueue.prototype.getCurrentTimedEventId.mockImplementation(
				() => {
					return 1; // the original event id
				}
			);

			const result = mockEventService['getCurrentlyActionableEvent'](12);

			expect(result).toEqual({
				event: mockEvents_1[1],
				action: EventAction.START
			});
		});
	});

	describe('actionEvent', () => {
		test("should call 'startEventCallback' if the action is set to EventAction.START", () => {
			const spy = jest.spyOn(mockEventService, 'startEventCallback');

			mockEventService['actionEvent']({
				event: { in: 20, out: 20 },
				action: EventAction.START
			});

			expect(spy).toBeCalled();
		});

		test("should call 'stopEventCallback' if the action is set to EventAction.STOP", () => {
			const spy = jest.spyOn(mockEventService, 'stopEventCallback');

			mockEventService['actionEvent']({
				event: { in: 20, out: 20 },
				action: EventAction.STOP
			});

			expect(spy).toBeCalled();
		});

		test('should call the advanceQueue method on the event queue', () => {
			mockEventService['actionEvent']({
				event: { in: 20, out: 20 },
				action: EventAction.START
			});

			const queue = mockEventService['queue'];
			const spy = jest.spyOn(queue, 'advanceQueue');

			expect(spy).toBeCalled();
		});
	});
});
