import { el, setStyle } from 'redom';

import { progressCounterStyle } from './styles';

class ProgressCounter {
	constructor() {
		this.el = el('.progressCounter', {
			style: { ...progressCounterStyle }
		});
	}

	update(currentTime = 0, duration) {
		const percentage = (currentTime / duration) * 100;

		setStyle(this.el, { width: `${percentage}%` });
	}
}

export default ProgressCounter;
