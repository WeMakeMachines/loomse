import RadioService from '../index';

describe('RadioService', () => {
	let radioService: RadioService;

	beforeEach(() => {
		radioService = new RadioService();
	});

	describe('broadcast method', () => {
		test('should broadcast on the correct channel', () => {
			const functionToCall = jest.fn();
			const channel = 'lemon';

			radioService.registry = {
				[channel]: { abc: { handler: functionToCall } }
			};

			radioService.broadcastOnChannel(channel);

			expect(functionToCall).toHaveBeenCalled();
		});

		test('should broadcast the expected message', () => {
			let response;

			const message = 'yellow';
			const functionToCall = (message: any) => (response = message);
			const channel = 'lemon';

			radioService.registry = {
				[channel]: { abc: { handler: functionToCall } }
			};

			radioService.broadcastOnChannel(channel, message);

			expect(response).toEqual(message);
		});
	});

	describe('register method', () => {
		test('should add the channel to the registry', () => {
			const channel = 'lemon';

			radioService.listenToChannel(channel, () => {});

			expect(radioService.registry.hasOwnProperty(channel)).toEqual(true);
		});

		test('should return a listener token', () => {
			const listenerToken = radioService.listenToChannel(
				'lemon',
				() => {}
			);

			expect(typeof listenerToken).toEqual('string');
		});
	});

	describe('unRegister method', () => {
		test('should remove the handler from the radioService registry', () => {
			const channel = 'lemon';
			const listenerToken = radioService.listenToChannel(
				channel,
				() => {}
			);

			radioService.listenToChannel(channel, () => {});
			radioService.stopListening(listenerToken);

			expect(radioService.registry[channel][listenerToken]).toEqual(
				undefined
			);
		});

		test('should remove the channel if there are no handlers available', () => {
			const channel = 'lemon';
			const listenerToken = radioService.listenToChannel(
				channel,
				() => {}
			);

			radioService.stopListening(listenerToken);

			expect(radioService.registry[channel]).toEqual(undefined);
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
					radioService.listenToChannel(
						channel,
						this.setContext,
						this
					);
				}
			};

			myModule.radioServiceRegister();

			radioService.broadcastOnChannel(channel);

			expect(myModule.context).toEqual(myModule);
		});
	});

	describe('tokenGenerator', () => {
		test('it should return a string of the length specified', () => {
			const length = 32;
			const token = RadioService.tokenGenerator(length);

			expect(token.length).toEqual(length);
		});
	});
});
