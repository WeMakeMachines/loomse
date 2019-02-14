import Component from '../Abstract';
import Text from '../Text';

export class Block extends Component {
	constructor(options) {
		super(options);

		if (options.text) {
			this.text = new Text({ text: options.text, parent: this.node });
		}

		this.x = options.x;
		this.y = options.y;
	}

	render() {
		this.text.mount();
		this.mount();
		if (this.x && this.y) {
			this.setPositionFromPercentage(this.x, this.y);
		}
	}
}
