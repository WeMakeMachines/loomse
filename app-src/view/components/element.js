/**
 * Creates a new DOM element or returns an existing DOM element
 */
class Element {

	/**
	 * Returns a valid DOM element
	 * @param {object} options
	 * @returns {object}
	 */
	static createNode(options) {

		let node = document.createElement(options.type);

		if (options.id) {

			let getElementById = document.getElementById(options.id);

			node = getElementById || node;

			node.setAttribute('id', options.id);

		}

		return node;
	}

	/**
	 * @param {object} options
	 */
	constructor(options) {

		options = options || {};

		if (typeof options !== 'object') { throw '[Element] instantiation error'; }

		options.type = options.type || 'div';

		this.parent = options.parent;
		this.node = this.constructor.createNode(options);

	}

	/**
	 * @param {object} child
	 * @returns {Element}
	 */
	attach(child) {

		try {
			if (child.node) {
				this.node.appendChild(child.node);
			} else {
				this.node.appendChild(child);
			}
		} catch (error) {
			throw `[Element] unable to attach node: ${error}`;
		}

		return this;
	}

	/**
	 * @returns {Element}
	 */
	attachToParent() {

		try {
			if (this.parent && this.parent.attach) {
				this.parent.attach(this.node);
			} else {
				this.parent.appendChild(this.node);
			}
		} catch (error) {
			throw `[Element] unable to attach node: ${error}`;
		}

		return this;
	}

	/**
	 * @param {object} child
	 * @returns {Element}
	 */
	detach(child) {

		try {
			if (child.node) {
				this.node.removeChild(child.node);
			} else {
				this.node.removeChild(child);
			}
		} catch (error) {
			throw `[Element] unable to remove node: ${error}`;
		}

		return this;
	}

	/**
	 * @returns {Element}
	 */
	detachFromParent() {

		try {
			this.parent.detach(this.node);
		} catch (error) {
			throw `[Element] unable to remove node : ${error}`;
		}

		return this;
	}

	/**
	 * Attaches a list of css classes to element
	 * @param {string | array} classList
	 * @returns {Element}
	 */
	setClass(classList) {

		if (!classList || !(typeof classList === 'string' || Array.isArray(classList))) {
			throw '[Element] invalid parameters';
		}

		classList = typeof classList === 'string' ? [classList] : classList;

		classList.forEach((cssClass) => {
			this.node.classList.add(cssClass);
		});

		return this;
	}

	/**
	 * @param {object} attributes
	 * @returns {Element}
	 */
	setAttributes(attributes) {
		if (typeof attributes !== 'object') { throw '[Element] invalid parameters'; }

		for (let key in attributes) {
			if (attributes.hasOwnProperty(key)) {
				this.node.setAttribute(key, attributes[key]);
			}
		}

		return this;
	}

	/**
	 * Method for setting style properties
	 * @param {object} properties
	 * @returns {Element}
	 */
	setStyle(properties) {

		if (typeof properties !== 'object') { throw '[Element] invalid parameters'; }

		for (let property in properties) {
			if (properties.hasOwnProperty(property)) {
				let value = properties[property];

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

				this.node.style[property] = value;
			}
		}

		return this;
	}

	/**
	 * Creates an inner text node
	 * @param {string} text
	 * @returns {Element}
	 */
	setText(text) {

		if (!text || typeof text !== 'string') { throw '[Element] invalid text'; }

		let textNode = document.createTextNode(text);

		this.node.appendChild(textNode);

		return this;

	}

	/**
	 * Sets inner HTML content
	 * @param {string} htmlString
	 * @returns {Element}
	 */
	setHtml(htmlString) {

		if (!htmlString || typeof htmlString !== 'string') { throw '[Element] invalid html'; }

		this.node.innerHTML = htmlString;

		return this;

	}

	/**
	 * Sets absolute position of element
	 * @param {object} containerDimensions
	 * @param {number} x
	 * @param {number} y
	 * @returns {Element}
	 */
	setPosition(containerDimensions, x, y) {

		this.dimensions = this.getDimensions();

		this.calculatePosition(containerDimensions, x, y);

		if (!this.coordinates) { throw '[Element] invalid dimensions'; }

		this.setStyle({
			left: this.coordinates.x,
			top : this.coordinates.y
		});

		return this;
	}

	/**
	 * Gets physical element dimensions from browser
	 * @returns {object}
	 */
	getDimensions() {

		let dimensions = {
				width : null,
				height: null
			},
			body = document.getElementsByTagName('body')[0],
			clone = this.node.cloneNode(true);

		clone.setAttribute('style', 'display: inline-block !important; position: absolute; left: 0; top: 0; z-index: -100');

		body.appendChild(clone);

		dimensions.width = clone.clientWidth;
		dimensions.height = clone.clientHeight;

		body.removeChild(clone);

		return dimensions;
	}

	/**
	 * Calculates real world pixel co-ordinates from percentages
	 * @param {object} parentDimensions
	 * @param {number} x % 0 - 1
	 * @param {number} y % 0 - 1
	 * @returns {Element}
	 */
	calculatePosition(parentDimensions, x, y) {

		if (typeof x !== 'number' || typeof y !== 'number' || !this.dimensions) { throw '[Element] invalid dimensions'; }

		let minRange = 0,
			maxRange = 1;

		if (x < minRange || x > maxRange) { x = minRange; }
		if (y < minRange || y > maxRange) { y = minRange; }

		let availableDimensions = {
			width : parentDimensions.width - this.dimensions.width,
			height: parentDimensions.height - this.dimensions.height
		};

		this.coordinates = {
			x: Math.round(availableDimensions.width * x),
			y: Math.round(availableDimensions.height * y)
		};

		return this;
	}
}

const element = (options) => new Element(options);

export { element as default };