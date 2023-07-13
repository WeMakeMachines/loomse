import Radio from '../radio';

describe('Radio', () => {
	let radio: Radio;

	beforeEach(() => {
		radio = new Radio();
	});

	describe('broadcast method', () => {
		test('should broadcast on the correct channel', () => {
			const functionToCall = jest.fn();
			const channel = 'lemon';

			radio.registry = {
				[channel]: { abc: { handler: functionToCall } }
			};

			radio.broadcastOnChannel(channel);

			expect(functionToCall).toHaveBeenCalled();
		});

		test('should broadcast the expected message', () => {
			let response;

			const message = 'yellow';
			const functionToCall = (message: any) => (response = message);
			const channel = 'lemon';

			radio.registry = {
				[channel]: { abc: { handler: functionToCall } }
			};

			radio.broadcastOnChannel(channel, message);

			expect(response).toEqual(message);
		});
	});

	describe('register method', () => {
		test('should add the channel to the registry', () => {
			const channel = 'lemon';

			radio.listenToChannel(channel, () => {});

			expect(radio.registry.hasOwnProperty(channel)).toEqual(true);
		});

		test('should return a listener token', () => {
			const listenerToken = radio.listenToChannel('lemon', () => {});

			expect(typeof listenerToken).toEqual('string');
		});
	});

	describe('unRegister method', () => {
		test('should remove the handler from the radioService registry', () => {
			const channel = 'lemon';
			const listenerToken = radio.listenToChannel(channel, () => {});

			radio.listenToChannel(channel, () => {});
			radio.stopListening(listenerToken);

			expect(radio.registry[channel][listenerToken]).toEqual(undefined);
		});

		test('should remove the channel if there are no handlers available', () => {
			const channel = 'lemon';
			const listenerToken = radio.listenToChannel(channel, () => {});

			radio.stopListening(listenerToken);

			expect(radio.registry[channel]).toEqual(undefined);
		});
	});

	describe('register / broadcast methods', () => {
		test('should run the handler in the correct context', () => {
			const channel = 'lemon';

			const myModule = {
				context: {},
				setContext() {
					this.context = this;
				},
				radioServiceRegister() {
					radio.listenToChannel(channel, this.setContext, this);
				}
			};

			myModule.radioServiceRegister();

			radio.broadcastOnChannel(channel);

			expect(myModule.context).toEqual(myModule);
		});
	});

	describe('tokenGenerator', () => {
		test('it should return a string of the length specified', () => {
			const length = 32;
			const token = Radio.tokenGenerator(length);

			expect(token.length).toEqual(length);
		});
	});
});
