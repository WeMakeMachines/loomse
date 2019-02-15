class ComponentError extends Error {
    constructor(message) {
        super(message);
    }
}

export class Component {

    /**
     * Returns a valid DOM element
     * @param {object} options
     * @returns {object}
     */
    static createNode(options) {

        if (!options.type) {
            options.type = 'div';
        }

        const node = document.createElement(options.type);

        if (options.id && document.getElementById(options.id)) {
            throw new ComponentError('DOM element already exists');
        } else if (options.id) {
            node.setAttribute('id', options.id);
        }

        return node;
    }

    constructor(options) {
        options = options || {};

        this.node = options.node && typeof options.node === 'object' ?
            options.node : this.constructor.createNode(options);

        this.mounted = false;
        this.parent = options.parent || null;
        this.visible = options.visible || true;
        this.children = options.children || [];
        this.textNode = options.text ?
            document.createTextNode(options.text) : null;

        if (!this.visible) {
            this.hide();
        }

        if (this.textNode) {
            this.node.appendChild(this.textNode);
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

    attach(component) {
        this.children.push(component);

        this.node.appendChild(component.node);
    }

    mount(options) {
        let parent;

        if (this.mounted) {
            throw new ComponentError('Component already mounted');
        }

        if (!this.parent && !options) {
            throw new ComponentError('Parent not found');
        }

        if (this.parent && typeof this.parent === 'object') {
            this.parent.appendChild(this.node);
            this.mounted = true;
            return;
        }

        if (typeof options.node === 'object') {
            parent = options.node;
        }

        if (options.id) {
            parent = document.getElementById(options.id);
        }

        if (options.selector) {
            parent = document.querySelector(options.selector);
        }

        if (parent && typeof parent === 'object') {
            parent.appendChild(this.node);
            this.mounted = true;
            this.parent = parent;
        } else {
            throw new ComponentError('Parent not found');
        }
    }

    mountToBody() {
        if (this.parent) {
            throw new ComponentError('Component already mounted');
        }

        const parent = document.querySelector('body');

        if (parent) {
            parent.appendChild(this.node);
            this.parent = parent;
        } else {
            throw new ComponentError('DOM not ready');
        }
    }

    unmount() {
        if (!this.parent) {
            throw new ComponentError('Parent not found');
        }

        this.parent.removeChild(this.node);
    }

    /**
     * Attaches a list of css classes to element
     * @param {string | array} classList
     */
    setClass(classList) {

        if (!classList || !(typeof classList === 'string' || Array.isArray(classList))) {
            throw new Error('[Element] invalid parameters');
        }

        classList = typeof classList === 'string' ? [classList] : classList;

        classList.forEach((cssClass) => {
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

        for (let key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                this.node.setAttribute(key, attributes[key]);
            }
        }
    }

    /**
     * Method for setting style properties
     * @param {object} properties
     */
    setStyles(properties) {
        if (typeof properties !== 'object') {
            throw new ComponentError('Invalid properties');
        }

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
    }

    /**
     * Creates an inner text node
     * @param {string} text
     */
    setText(text) {
        if (!text || typeof text !== 'string') {
            throw new ComponentError('Invalid string');
        }

        let textNode = document.createTextNode(text);

        this.node.appendChild(textNode);
    }

    /**
     * Sets inner HTML content
     * @param {string} htmlString
     */
    setHtml(htmlString) {
        if (!htmlString || typeof htmlString !== 'string') {
            throw new ComponentError('Invalid HTML');
        }

        this.node.innerHTML = htmlString;
    }

    /**
     * Sets absolute position of element
     * @param {object} containerDimensions
     * @param {number} x
     * @param {number} y
     */
    setPosition(containerDimensions, x, y) {

        this.dimensions = this.getDimensions();

        this.calculatePosition(containerDimensions, x, y);

        if (!this.coordinates) {
            throw new ComponentError('Invalid dimensions');
        }

        this.setStyles({
            left: this.coordinates.x,
            top : this.coordinates.y
        });
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
            width : dimensions.width,
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
     * @param {number} x % 0 - 1
     * @param {number} y % 0 - 1
     */
    setPositionFromPercentage(x, y) {
        if (!this.parent) {
            console.warn('Unable to set position; no parent set');
            return;
        }

        if (typeof x !== 'number' || typeof y !== 'number') {
            console.warn('Unable to set position; invalid co-ordinates');
            return;
        }

        let minRange = 0,
            maxRange = 1;

        if (x < minRange || x > maxRange) { x = minRange; }
        if (y < minRange || y > maxRange) { y = minRange; }

        const availableDimensions = {
            width : this.parent.offsetWidth - this.node.offsetWidth,
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
}
