import { mount, unmount } from 'redom';

import { pluginRegistry } from '../../services/pluginRegistryService';

export interface PluginProps {
	name: string;
	parentEl: HTMLElement;
	el: HTMLElement;
	alwaysOn?: boolean;
	hooks?: {
		run?: () => void;
		cleanup?: () => void;
	};
}

export default class Plugin {
	public readonly name: string;
	public readonly parentEl: HTMLElement;
	public readonly el: HTMLElement;
	public readonly alwaysOn: boolean;
	public readonly hooks: {
		run?: () => void;
		cleanup?: () => void;
	};

	static registerPlugin(pluginProps: PluginProps) {
		const plugin = new Plugin(pluginProps);
		pluginRegistry.registerPlugin(plugin);

		return;
	}

	constructor({ name, parentEl, el, alwaysOn, hooks = {} }: PluginProps) {
		this.name = name;
		this.parentEl = parentEl;
		this.el = el;
		this.alwaysOn = alwaysOn || false;
		this.hooks = {
			run: hooks?.run,
			cleanup: hooks?.cleanup
		};

		if (alwaysOn) {
			mount(this.parentEl, this.el);
		}
	}

	unmount() {
		if (this.hooks.cleanup) {
			this.hooks.cleanup();
		}

		unmount(this.parentEl, this.el);
	}
}
