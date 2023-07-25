import { mount as redomMount, unmount } from 'redom';

export interface PluginProps {
	name: string;
	mount?: {
		parentEl: HTMLElement;
		el: HTMLElement;
		onLoad?: boolean;
		persist?: boolean;
	};
	hooks?: {
		run?: (payload?: object) => void;
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
		run?: (payload?: object) => void;
		cleanup?: () => void;
	};

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
