import Component from '../Abstract';

import Stage from '../Stage';
import Overlay from '../Overlay';

import { browser } from '../../../services';
import { debounce } from '../../tools';

import state from '../../state';

import styles from './styles';

export class View extends Component {

	constructor(node) {

		super({
			node,
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
		this.mountToBody();
		this.setListeners();
		this.resizeComponents();
	}

	mountContainers() {
		for (let key in this.containers) {
			if (!this.containers.hasOwnProperty(key)) { continue; }

			const container = this.containers[key];

			container.mount({ node: this.node });
		}
	}

	setListeners() {
		const debounceDelay = 200;
		const fullscreenEvent = this.fullscreen.returnEvent();
		const resizeComponents = this.resizeComponents.bind(this);

		window.addEventListener('resize', function () {
			debounce(resizeComponents, debounceDelay);
		});

		if (fullscreenEvent) {
			document.addEventListener(fullscreenEvent, function () {
				resizeComponents();
			});
		}
	}

	resizeComponents() {
		state.clientDimensions = browser.getClientDimensions();

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
				width : state.clientDimensions.width,
				height: state.clientDimensions.height
			});
		}
	}
}
