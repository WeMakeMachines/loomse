import { mount as redomMount, unmount } from 'redom';

import { pluginRegistryService } from '../../services';

export interface PluginProps {
	name: string;
	mount?: {
		parentEl: HTMLElement;
		el: HTMLElement;
		onLoad?: boolean;
		persist?: boolean;
	};
	hooks?: {
		run?: () => void;
		cleanup?: () => void;
	};
}

class PluginError extends Error {}

export default class Plugin {
	public readonly name: string;
	public readonly mount?: {
		onLoad?: boolean;
		persist?: boolean;
		parentEl: HTMLElement;
		el: HTMLElement;
	};
	public readonly hooks?: {
		run?: () => void;
		cleanup?: () => void;
	};

	static registerPlugin(pluginProps: PluginProps) {
		const plugin = new Plugin(pluginProps);
		pluginRegistryService.registerPlugin(plugin);

		console.log(`Loomse: Plugin "${pluginProps.name}" registered`);

		return;
	}

	constructor({ name, hooks, mount }: PluginProps) {
		this.name = name;
		this.hooks = {
			run: hooks?.run,
			cleanup: hooks?.cleanup
		};

		if (mount) {
			if (!mount.el || !mount.parentEl) {
				throw new PluginError(
					'Unable to register plugin, no suitable mount point'
				);
			}

			this.mount = mount;

			if (mount.onLoad) {
				redomMount(this.mount.parentEl, this.mount.el);
			}
		}
	}

	unmount() {
		if (this.hooks?.cleanup) {
			this.hooks.cleanup();
		}

		if (this.mount) {
			unmount(this.mount.parentEl, this.mount.el);
		}
	}
}
