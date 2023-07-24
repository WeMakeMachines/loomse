# Creating a plugin

In this tutorial, we will create a very simple plugin for a common use case - skipping from one scene to another, based on a timed event.

In this example, when the video playback time for a scene goes past a certain value, an event will fire which will trigger the plugin we will create.

## Configuration

### 1.

Create a new configuration object for the plugin

```js
const skipToScene = {
    name: "skipToScene"
}
```

> Note: The plugin `name` must be unique!

### 2.

Since this type of plugin does not contain any _DOM nodes_, we can skip the optional `mount` property in our configuration

### 3.

Since we want to the plugin to trigger on a script event, we must write a hook to handle this action.

For this code to work, we make the assumption that `loomse` contains an instance of `Loomse`.

```ts
interface PluginPayloadSkipToScene {
    nextScene: string;
}

const skipToScene = {
    name: "skipToScene",
    hooks: {
        run: (payload: PluginPayloadSkipToScene): void => {
            
            if (payload.nextScene) {
                loomse.skipTo(nextScene);
            }
        },
    },
}
```

To skip to the new scene we are using the [skipTo()](API/LOOMSE-INSTANCE.md#skipto-scenename) method.

## Registering

Before we can use our plugin, we must register it. To tidy things up, we might wrap it in a function, and call it when we are ready.

```ts
function enableSkipToScenePlugin(loomse: LoomseType) {
    
    loomse.registerPlugin({
        name: "skipToScene",
        hooks: {
            run: (payload: SkipToPayload): void => {
                const { nextScene } = payload;

                if (nextScene) {
                    loomse.skipTo(nextScene);
                }
            },
        },
    });
}
```
 
## Triggering the plugin via the script

For our plugin to be triggered, we must configure our script with an event trigger point. For example;

```json
{
    "pluginName": "skipToScene",
    "in": 1000,
    "out": 1000,
    "payload": {
      "nextScene": "scene-2"
    }
}
```

Within the full context of the script, it would look like this;

```json
{
  "firstScene": "scene-1",
  "scenes": {
    "scene-1": {
      "video": {
        "sources": {
          "mp4": "assets/mp4/video.mp4"
        }
      },
      "events": [
        {
          "pluginName": "skipToScene",
          "in": 1000,
          "out": 1000,
          "payload": {
            "nextScene": "scene-2"
          }
        }
      ]
    },
    "scene-2": {
      "video": {
        "sources": {
          "mp4": "assets/mp4/scene-2.mp4"
        }
      },
      "events": []
    }
  }
}
```
