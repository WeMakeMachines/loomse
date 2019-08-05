import Component from '../Abstract';

import Stage from '../Stage';
import Overlay from '../Overlay';

import { browser, radioService } from '../../../lib';
import { debounce } from '../../tools';

import { STAGE_RESIZE } from '../../../constants/applicationActions';

import state from '../../state';

import styles from './styles';

import appConfig from '../../appConfig';

export class View extends Component {
	constructor(parent, config = appConfig) {
		super({
			parent,
			id: 'view',
			styles: styles.view
		});

		this.resizeVideoTo = config.resizeVideoTo;
		this.fullscreen = browser.fullscreen(this.node);

		this.containers = {
			stage: new Stage({
				id: 'stage',
				layer: 0
			}),
			overlay: new Overlay({
				id: 'overlay',
				layer: 1
			})
		};

		this.mountContainers();
		this.mount();
		this.setListeners();
		this.updateClientDimensions();
	}

	mountContainers() {
		for (const key in this.containers) {
			if (!this.containers.hasOwnProperty(key)) {
				continue;
			}

			const container = this.containers[key];

			container.mountTo(this.node);
		}
	}

	setListeners() {
		const debounceDelay = 200;
		const fullscreenEvent = this.fullscreen.returnEvent();
		const updateClientDimensions = this.updateClientDimensions.bind(this);

		window.addEventListener('resize', function() {
			debounce(updateClientDimensions, debounceDelay);
		});

		if (fullscreenEvent) {
			document.addEventListener(fullscreenEvent, function() {
				updateClientDimensions();
			});
		}
	}

	updateClientDimensions() {
		switch (this.resizeVideoTo) {
			default:
			case 'parent':
				state.clientDimensions = browser.getElementDimensions(this.parent);
				break;
			case 'window':
				state.clientDimensions = browser.getWindowDimensions();
		}

		this.resizeComponents();
	}

	resizeComponents() {
		const components = [
			this,
			this.containers.stage,
			this.containers.overlay,
			...this.containers.stage.children,
			...this.containers.overlay.children
		];

		components.forEach(component =>
			component.resize({
				width: state.clientDimensions.width,
				height: state.clientDimensions.height
			})
		);

		radioService.broadcast(STAGE_RESIZE, {
			width: state.clientDimensions.width,
			height: state.clientDimensions.height
		});
	}
}
