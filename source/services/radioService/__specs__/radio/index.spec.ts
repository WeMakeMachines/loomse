import { Radio } from '../../radio';

describe('radio', () => {
	let radio: Radio;

	beforeEach(() => {
		radio = new Radio();
	});

	describe('Radio static method tokenGenerator should', () => {
		test('generate an alphanumeric string of a given length (32)', () => {
			const string = Radio.tokenGenerator(32);

			expect(string.length).toEqual(32);
			expect(string).toMatch(/^[a-zA-Z0-9]+$/);
		});
	});

	describe('register method', () => {
		test('should add the channel to the registry', () => {
			const channel = 'guybrush:threepwood';

			radio.listenToChannel(channel, () => {});

			expect(radio['registry'].hasOwnProperty(channel)).toEqual(true);
		});

		test('should return a function', () => {
			const channel = 'guybrush:threepwood';
			const deregisterFunction = radio.listenToChannel(channel, () => {});

			expect(deregisterFunction).toEqual(expect.any(Function));
		});

		test('should return a deregister function, which when executed, removes the listener from the registry', () => {
			const channel = 'guybrush:threepwood';
			const deregisterFunction = radio.listenToChannel(channel, () => {});

			deregisterFunction();

			expect(radio['registry'][channel]).toBeUndefined();
		});
	});

	describe('radio', () => {
		test('should execute listeners when broadcasting on a channel, with the expected signal', () => {
			const channel = 'guybrush:threepwood';
			const listenerToken1 = 'f9fkaADFKASq93adfU9EF';
			const listenerToken2 = 'LADF8w3r9fA4WAg9agrds';
			radio['registry'][channel] = {
				[listenerToken1]: jest.fn(),
				[listenerToken2]: jest.fn()
			};

			const signal = 'hello';
			radio.broadcastOnChannel(channel, signal);

			expect(
				radio['registry'][channel][listenerToken1]
			).toHaveBeenCalledWith(signal);
			expect(
				radio['registry'][channel][listenerToken2]
			).toHaveBeenCalledWith(signal);
		});
	});

	describe('stopListening method', () => {
		test('should remove the handler from the radioService registry', () => {
			const channel = 'guybrush:threepwood';
			const listenerToken1 = 'f9fkaADFKASq93adfU9EF';
			const listenerToken2 = 'LADF8w3r9fA4WAg9agrds';

			radio['registry'][channel] = {
				[listenerToken1]: jest.fn(),
				[listenerToken2]: jest.fn()
			};

			radio.stopListening(listenerToken1);

			expect(radio['registry'][channel][listenerToken1]).toBeUndefined();
		});

		test('should remove the channel if there are no handlers available', () => {
			const channel = 'guybrush:threepwood';
			const listenerToken = 'f9fkaADFKASq93adfU9EF';

			radio['registry'][channel] = {
				[listenerToken]: jest.fn()
			};

			radio.stopListening(listenerToken);

			expect(radio['registry'][channel]).toEqual(undefined);
		});
	});
});
