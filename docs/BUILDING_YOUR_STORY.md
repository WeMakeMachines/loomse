# Building Your Story

All the power for developing your non-linear narrative rests inside the JSON based script file. 
  
You could also define separate scripts for mobile and desktop (you will have to pass in the correct script into Loomse).

## Example Script

You can view an [example script](loomse-story-example.json) to give you an idea of how to structure your JSON.

## Schema

The [script schema](schemas/loomse-story.json) contains the entire specification of what is valid JSON.

You can use the schema with a validation tool such as AJV, to validate your JSON.

## Scenes and events

### Scenes

In Loomse, videos are organised in "scenes". Before adding your video, you must create a scene.

You can only provide one video file per scene, but you can supply that video in multiple formats (for example `mp4`, `ogg` or `webm`).

In the following example, we create one scene called "intro":

```json
{
  "scenes": {
    "intro": {
      "longName": "",
      "video": {
        "autoplay": true,
        "muted": true,
        "sources": {
          "mp4": "intro.mp4"
        }
      },
      "events": []
    }
  }
}
```

A scene must include a video and a have an events property (even if it is empty).

### Adding an event to a scene

Events are added as an array of objects. The following is an example of one event:

```json
[
    {
      "pluginName": "skipToScene",
      "in": 60,
      "out": 60,
      "payload": {
        "nextScene": "farmhack"
      }
    }
]
```

`pluginName` - refers to the plugin which will be triggered

`in` - refers to the start time of the event (in milliseconds)

`out` - refers to the stop time of the event (in milliseconds)

`payload` - through this you can pass custom data to your plugin

#### Example use

In the following example, we will define 2 scenes.

The first scene will refer to the second scene via an event.

```json
{
  "scenes": {
    "intro": {
      "longName": "",
      "video": {
        "autoplay": true,
        "muted": true,
        "sources": {
          "mp4": "intro.mp4"
        }
      },
      "events": [
        {
          "pluginName": "skipToScene",
          "in": 50,
          "out": 50,
          "payload": {
            "nextScene": "phone-call"
          }
        }
      ]
    },
    "phone-call": {
      "longName": "",
      "video": {
        "autoplay": true,
        "muted": true,
        "sources": {
          "mp4": "phone-call.mp4"
        }
      },
      "events": []
    }
  }
}
```
