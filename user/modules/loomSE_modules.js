const loomSE_modules = {

	overlayText: function() {
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

};
