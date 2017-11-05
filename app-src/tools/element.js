class Element {

	constructor(options) {

		options = options || {};

		options.type = options.type || 'div';

		this.node = document.getElementById(options.id) || document.createElement(options.type);

		if (options.id) {
			this.node.setAttribute('id', options.id);
		}

		if (options.classList) {
			this.classList = options.classList;
			this.setCss();
		}

	}

	setCss(cssClass) {

		if (cssClass) {
			this.classList = cssClass;
		}

		if (typeof this.classList === 'string') {
			this.classList = [this.classList];
		}

		if (Array.isArray(this.classList)) {
			this.classList.forEach((cssClass) => {
				this.node.classList.add(cssClass);
			});
		}

		return this;

	}

	setAttributes(attributes) {

		if (typeof attributes !== 'object') { return; }

		for (let key in attributes) {
			if (attributes.hasOwnProperty(key)) {
				this.node.setAttribute(key, attributes[key]);
			}
		}

		return this;

	}

	setStyle(styleProperties) {
		for (let attribute in styleProperties) {
			if (styleProperties.hasOwnProperty(attribute)) {
				let value = styleProperties[attribute];

				switch (attribute) {
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

				this.node.style[attribute] = value;
			}
		}

		return this;

	}

	setPosition() {

		if (!this.coordinates) { return; }

		this.setStyle({
			left: `${this.coordinates.x}`,
			top : `${this.coordinates.y}`
		});

		return this;

	}

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

		this.dimensions = dimensions;

		return this;

	}

	/**
	 * Calculate real world pixel co-ordinates from percentages
	 * @param {object} parentDimensions
	 * @param {number} x % 0 - 1
	 * @param {number} y % 0 - 1
	 */
	calculatePosition(parentDimensions, x, y) {

		if (typeof x !== 'number' || typeof y !== 'number' || !this.dimensions) { return; }

		let minRange = 0,
			maxRange = 1;

		if (x < minRange || x > maxRange) { x = minRange; }
		if (y < minRange || y > maxRange) { y = minRange; }

		let availableDimensions = {
			width : parentDimensions.width - this.dimensions.width,
			height: parentDimensions.height - this.dimensions.height
		};

		this.coordinates = {
			x: availableDimensions.width * x,
			y: availableDimensions.height * y
		};

		return this;

	}

}

export { Element as default };