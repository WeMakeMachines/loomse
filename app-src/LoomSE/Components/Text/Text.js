import Component from '../Abstract';

export class Text extends Component {
	constructor(options) {
		super({
			type: 'p',
			class: options.class,
			text: options.text,
			parent: options.parent
		});
	}
}
