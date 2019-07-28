import Component from '../Abstract';

import Stage from '../Stage';
import Overlay from '../Overlay';

import { browser, radioService } from '../../../lib';
import { debounce } from '../../tools';

import { STAGE_RESIZE } from '../../../constants/applicationActions';

import state from '../../state';

import styles from './styles';

export class View extends Component {
	constructor(parent) {
		super({
			parent,
			id: 'view',
			styles: styles.view
		});

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
		this.resizeComponents();
	}

	mountContainers() {
		for (const key in this.containers) {
			if (!this.containers.hasOwnProperty(key)) {
				continue;
			}

			const container = this.containers[key];

			container.mount({ node: this.node });
		}
	}

	setListeners() {
		const debounceDelay = 200;
		const fullscreenEvent = this.fullscreen.returnEvent();
		const resizeComponents = this.resizeComponents.bind(this);

		window.addEventListener('resize', function() {
			debounce(resizeComponents, debounceDelay);
		});

		if (fullscreenEvent) {
			document.addEventListener(fullscreenEvent, function() {
				resizeComponents();
			});
		}
	}

	resizeComponents() {
		state.clientDimensions = browser.getWindowDimensions();

		const components = [
			this,
			this.containers.stage,
			this.containers.overlay,
			...this.containers.stage.children,
			...this.containers.overlay.children
		];

		for (let i = 0; i < components.length; i += 1) {
			const component = components[i];

			component.resize({
				width: state.clientDimensions.width,
				height: state.clientDimensions.height
			});
		}

		radioService.broadcast(STAGE_RESIZE, {
			width: state.clientDimensions.width,
			height: state.clientDimensions.height
		});
	}
}
