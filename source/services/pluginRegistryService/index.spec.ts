import 'reflect-metadata';
import PluginRegistryService from './index';

describe('PluginRegistryService', () => {
	let pluginRegistryService: PluginRegistryService;

	beforeEach(() => {
		pluginRegistryService = new PluginRegistryService();
	});

	describe('method registerPlugin should', () => {
		test('throw an error if the plugin has already been registered', () => {
			const plugin = {
				name: 'test-plugin',
				unmount() {}
			};

			pluginRegistryService['registry'] = {
				'test-plugin': plugin
			};

			expect(() =>
				pluginRegistryService.registerPlugin(plugin)
			).toThrow();
		});

		test('register the plugin to the registry, if the plugin does not exist', () => {
			const plugin = {
				name: 'test-plugin',
				unmount() {}
			};

			pluginRegistryService.registerPlugin(plugin);

			const result = pluginRegistryService['registry']['test-plugin'];

			expect(result).toEqual(plugin);
		});
	});

	describe('method getPlugin should', () => {
		test('return the plugin if it exists in the registry', () => {
			const plugin = {
				name: 'test-plugin',
				unmount() {}
			};

			pluginRegistryService['registry'] = {
				'test-plugin': plugin
			};

			const result = pluginRegistryService.getPlugin('test-plugin');

			expect(result).toEqual(plugin);
		});

		test('return undefined if the plugin does not exist in the registry', () => {
			const result = pluginRegistryService.getPlugin('test-plugin');

			expect(result).toBeUndefined();
		});
	});
});
