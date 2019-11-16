import RadioService from '../RadioService';

describe('RadioService', () => {
	let radioService;

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

			radioService.broadcast(channel);

			expect(functionToCall).toHaveBeenCalled();
		});

		test('should broadcast the expected message', () => {
			let response;

			const message = 'yellow';
			const functionToCall = message => (response = message);
			const channel = 'lemon';

			radioService.registry = {
				[channel]: { abc: { handler: functionToCall } }
			};

			radioService.broadcast(channel, message);

			expect(response).toEqual(message);
		});
	});

	describe('register method', () => {
		test('should add the channel to the registry', () => {
			const channel = 'lemon';

			radioService.register(channel, () => {});

			expect(radioService.registry.hasOwnProperty(channel)).toEqual(true);
		});

		test('should return an unregister token', () => {
			const token = radioService.register('lemon', () => {});

			expect(typeof token).toEqual('string');
		});
	});

	describe('unRegister method', () => {
		test('should remove the handler from the radioService registry', () => {
			const channel = 'lemon';
			const token = radioService.register(channel, () => {});

			radioService.register(channel, () => {});
			radioService.unRegister(token);

			expect(radioService.registry[channel][token]).toEqual(undefined);
		});

		test('should remove the channel if there are no handlers available', () => {
			const channel = 'lemon';
			const token = radioService.register(channel, () => {});

			radioService.unRegister(token);

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
					radioService.register(channel, this.setContext, this);
				}
			};

			myModule.radioServiceRegister();

			radioService.broadcast(channel);

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
