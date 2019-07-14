/**
 * User defined function space
 */

export function overlayText() {
	return {
		run(payload, element, render) {
			const text = document.createElement('p');

			text.innerText = 'Some text';

			element.appendChild(text);

			render();
		},

		stop() {}
	};
}
