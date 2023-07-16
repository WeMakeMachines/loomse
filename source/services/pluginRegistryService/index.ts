import Plugin from '../../components/Plugin';

type PluginName = string;

class PluginRegistryError extends Error {}

export class PluginRegistry {
	private readonly registry: {
		[key: PluginName]: Plugin;
	} = {};

	registerPlugin(plugin: Plugin) {
		if (this.registry[plugin.name])
			throw new PluginRegistryError(
				`Unable to register plugin: A plugin with the name "${plugin.name}" has already been registered`
			);

		this.registry[plugin.name] = plugin;
	}

	getPlugin(name: string): Plugin | undefined {
		if (!this.registry[name]) {
			return;
		}

		return this.registry[name];
	}
}

export const pluginRegistry = new PluginRegistry();
