import Component from '../Abstract';

export class Block extends Component {
	constructor(options) {
		super(options);

		this.x = options.x;
		this.y = options.y;
	}

	render() {
		this.mount();
		if (this.x && this.y) {
			this.setPositionFromPercentage(this.x, this.y);
		}
	}
}
