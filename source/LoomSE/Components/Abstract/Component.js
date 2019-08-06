import { radioService } from '../../../lib/radioService';

class ComponentError extends Error {}

export class Component {
	static createNode(type = 'div') {
		return document.createElement(type);
	}

	static createTextNode(text) {
		if (!text) {
			return null;
		}

		return document.createTextNode(text);
	}

	constructor(options = {}) {
		this.node =
			options.node && typeof options.node === 'object'
				? options.node
				: this.constructor.createNode(options.type);

		this.mounted = false;
		this.parent = options.parent || null;
		this.visible = options.visible || true;
		this._childRegistry = options.children || [];
		this._eventHandlerRegistry = {};

		if (!this.visible) {
			this.hide();
		}

		if (options.id) {
			this.setId(options.id);
		}

		if (options.text) {
			this.node.appendChild(this.constructor.createTextNode(options.text));
		}

		if (options.class) {
			this.setClass(options.class);
		}

		if (options.layer) {
			this.setLayer(options.layer);
		}

		if (options.styles) {
			this.setStyles(options.styles);
		}

		this.setStyles({
			position: 'absolute',
			top: 0,
			left: 0
		});
	}

	get children() {
		return this._childRegistry;
	}

	attach(component) {
		this._childRegistry.push(component);
		this.node.appendChild(component.node);

		component.mounted = true;
		component.parent = this.node;
	}

	removeChildren() {
		this._childRegistry.forEach(child => {
			if (child.mounted) {
				child.unmount();
				child.mounted = false;
			}
		});
	}

	mount() {
		if (this.mounted) {
			throw new ComponentError('Component already mounted');
		}

		if (
			this.parent &&
			typeof this.parent === 'object' &&
			this.parent.appendChild
		) {
			this.parent.appendChild(this.node);
			this.mounted = true;

			return;
		}

		throw new ComponentError('Parent not found');
	}

	mountTo(parent) {
		if (this.mounted) {
			throw new ComponentError('Component already mounted');
		}

		if (parent && typeof parent === 'object' && parent.appendChild) {
			this.parent = parent;
			this.parent.appendChild(this.node);
			this.mounted = true;

			return;
		}

		throw new ComponentError('Parent not found');
	}

	unmount() {
		if (!this.mounted) {
			return;
		}

		if (!this.parent) {
			throw new ComponentError('Parent not found');
		}

		this.parent.removeChild(this.node);
		this.mounted = false;
	}

	/**
	 * Attaches a list of css classes to element
	 * @param {string | array} classList
	 */
	setClass(classList) {
		if (
			!classList ||
			!(typeof classList === 'string' || Array.isArray(classList))
		) {
			throw new ComponentError('[Element] invalid parameters');
		}

		classList = typeof classList === 'string' ? [classList] : classList;

		classList.forEach(cssClass => {
			this.node.classList.add(cssClass);
		});
	}

	/**
	 * @param {object} attributes
	 */
	setAttributes(attributes) {
		if (typeof attributes !== 'object') {
			throw new ComponentError('Invalid attributes');
		}

		for (const key in attributes) {
			if (!attributes.hasOwnProperty(key)) {
				continue;
			}

			this.node.setAttribute(key, attributes[key]);
		}
	}

	setId(id = '') {
		if (!id) {
			return;
		}

		const elementExists = document.getElementById(id);

		if (elementExists) {
			throw new ComponentError('ID already in use');
		}

		this.node.setAttribute('id', id);
	}

	/**
	 * Method for setting style properties
	 * @param {object} properties
	 */
	setStyles(properties) {
		if (typeof properties !== 'object') {
			throw new ComponentError('Invalid properties');
		}

		for (const property in properties) {
			if (!properties.hasOwnProperty(property)) {
				continue;
			}
			let value = properties[property];

			if (typeof value === 'number') {
				switch (property) {
					case 'width':
					case 'height':
					case 'top':
					case 'left':
					case 'right':
					case 'bottom':
						value += 'px';
						break;
					default:
						break;
				}
			}

			this.node.style[property] = value;
		}
	}

	setLayer(layer) {
		this.setStyles({
			zIndex: layer
		});
	}

	/**
	 * Resizes an element
	 * @param {object} dimensions
	 */
	resize(dimensions) {
		this.setStyles({
			width: dimensions.width,
			height: dimensions.height
		});
	}

	show() {
		this.setStyles({
			visibility: 'visible'
		});
	}

	hide() {
		this.setStyles({
			visibility: 'hidden'
		});
	}

	/**
	 * Gets physical element dimensions from browser
	 * @returns {object}
	 */
	getDimensions() {
		const body = document.getElementsByTagName('body')[0];
		const clone = this.node.cloneNode(true);

		clone.setAttribute(
			'style',
			'display: inline-block !important; position: absolute; left: 0; top: 0; z-index: -100'
		);

		body.appendChild(clone);

		const dimensions = {
			width: clone.clientWidth,
			height: clone.clientHeight
		};

		body.removeChild(clone);

		return dimensions;
	}

	/**
	 * Calculates real world pixel co-ordinates from percentages
	 * @param {number} x % 0 - 1
	 * @param {number} y % 0 - 1
	 */
	setPositionFromPercentage(x = 0, y = 0) {
		const minRange = 0;
		const maxRange = 1;

		if (x < minRange || x > maxRange) {
			x = minRange;
		}
		if (y < minRange || y > maxRange) {
			y = minRange;
		}

		if (!this.parent) {
			console.warn('Unable to set position; no parent set');
			return;
		}

		const availableDimensions = {
			width: this.parent.offsetWidth - this.node.offsetWidth,
			height: this.parent.offsetHeight - this.node.offsetHeight
		};

		const coordinates = {
			x: Math.round(availableDimensions.width * x),
			y: Math.round(availableDimensions.height * y)
		};

		this.setStyles({
			left: coordinates.x,
			top: coordinates.y
		});
	}

	listenToChannel(channel, callback) {
		if (this._eventHandlerRegistry[channel]) {
			console.warn('Already listening to channel, ', channel);

			return;
		}

		this._eventHandlerRegistry[channel] = callback.bind(this);

		radioService.listen(channel, this._eventHandlerRegistry[channel]);
	}

	stopListeningToChannel(channel) {
		if (!this._eventHandlerRegistry[channel]) {
			console.warn('Handler not found, ', channel);

			return;
		}

		radioService.stopListening(channel, this._eventHandlerRegistry[channel]);

		delete this._eventHandlerRegistry[channel];
	}
}
