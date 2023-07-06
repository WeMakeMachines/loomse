import { el, setStyle } from 'redom';

import { progressCounterStyle } from './styles';

export default class ProgressCounter {
	public el: HTMLElement;

	constructor() {
		this.el = el('.progressCounter', {
			style: { ...progressCounterStyle }
		});
	}

	update(currentTime = 0, duration: number) {
		const percentage = (currentTime / duration) * 100;

		setStyle(this.el, { width: `${percentage}%` });
	}
}
