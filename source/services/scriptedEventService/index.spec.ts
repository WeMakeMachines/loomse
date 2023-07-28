import 'reflect-metadata';
import { container } from 'tsyringe';

import Plugin from '../../components/Plugin';
import { broadcastDirectorSceneEvent } from '../radioService/broadcasters';
import PluginRegistryService from '../pluginRegistryService';
import ScriptedEventService from './index';

jest.mock('../pluginRegistryService');
jest.mock('../radioService/broadcasters');

const MockPluginRegistryService = PluginRegistryService as jest.MockedClass<
	typeof PluginRegistryService
>;

MockPluginRegistryService.prototype.getPlugin.mockImplementation(
	(pluginName) => {
		return mockPluginRegistry.find((plugin) => pluginName === plugin.name);
	}
);

const mockPluginRegistry: Plugin[] = [
	{
		name: 'test-plugin-1',
		unmount: () => {}
	},
	{
		name: 'test-plugin-2',
		unmount: () => {}
	}
];

describe('ScriptedEventService', () => {
	let scriptedEventService: ScriptedEventService;
	let broadcastDirectorSceneEventCallTimes = 0;

	beforeEach(() => {
		container.clearInstances();
		scriptedEventService = container.resolve(ScriptedEventService);
	});

	test('when testing, PluginRegistryService should have a mock registry', () => {
		const plugin =
			scriptedEventService['pluginRegistryService'].getPlugin(
				'test-plugin-1'
			);

		expect(plugin).not.toBeUndefined();
	});

	describe('protected method startEventCallback', () => {
		test('should call the function broadcastDirectorSceneEvent 1x, for 2x startEventCallback calls, when the plugin IS found in the plugin registry and for when it is not', () => {
			scriptedEventService = container.resolve(ScriptedEventService);

			scriptedEventService['startEventCallback']({
				pluginName: 'test-plugin-1',
				payload: {},
				in: 1,
				out: 2
			});

			scriptedEventService['startEventCallback']({
				pluginName: 'unregistered-plugin',
				payload: {},
				in: 1,
				out: 2
			});

			broadcastDirectorSceneEventCallTimes += 1;

			expect(broadcastDirectorSceneEvent).toHaveBeenCalledTimes(
				broadcastDirectorSceneEventCallTimes
			);
		});
	});

	describe('protected method stopEventCallback', () => {
		test('should call the function broadcastDirectorSceneEvent 1x, for 2x startEventCallback calls, when the plugin IS found in the plugin registry and for when it is not', () => {
			scriptedEventService = container.resolve(ScriptedEventService);

			scriptedEventService['stopEventCallback']({
				pluginName: 'test-plugin-1',
				payload: {},
				in: 1,
				out: 2
			});

			scriptedEventService['stopEventCallback']({
				pluginName: 'unregistered-plugin',
				payload: {},
				in: 1,
				out: 2
			});

			broadcastDirectorSceneEventCallTimes += 1;

			expect(broadcastDirectorSceneEvent).toHaveBeenCalledTimes(
				broadcastDirectorSceneEventCallTimes
			);
		});
	});
});
