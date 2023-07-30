import { LoomseType } from '../../index';

type PluginPayloadChangeToScene = {
	nextScene: string;
};

export function enableChangeToScenePlugin(loomse: LoomseType) {
	loomse.registerPlugin({
		name: 'changeToScene',
		hooks: {
			run: (payload): void => {
				const typedPayload = <PluginPayloadChangeToScene>payload;

				if (!typedPayload || !typedPayload.nextScene) {
					console.warn(
						"Plugin: 'changeToScene' can not find a payload or payload.nextScene property"
					);

					return;
				}

				const { nextScene } = typedPayload;

				loomse.changeScene(nextScene);
			}
		}
	});
}
