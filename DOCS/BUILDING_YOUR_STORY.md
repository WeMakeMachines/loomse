# Build Your Story

All the power for developing your non-linear narrative rests inside a JSON based script file.  
  
You could also define separate scripts for mobile and desktop (you will have to pass in the correct script into LoomSE).

You can view a [example script](script-example.json) to give you an idea of how to structure your JSON.

Please refer to the [script schema](schemas/script.json).  

You can use the above schema with a validation tool such as AJV, to validate your JSON.

## Checklist

✔️ Video assets in one or more formats

## Adding a scene to the story script
In LoomSE, videos are organised in "scenes". Before adding your video, you must create a scene.

You can only provide 1 video per scene, but you can supply that video in multiple formats (for example `mp4`, `ogg` or `webm`).

In the following example, we create one scene called "intro":

```json
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
```

A scene must include a video and a have an events property (even if it is empty).

## Adding an event to a scene
Events are added as an array of objects. The following is an example of one event:

```json
[
    {
      "group": "skipTo",
      "in": 6000,
      "out": 6000,
      "payload": {
        "nextScene": "farmhack"
      }
    }
]
```

`group` - refers to a non-unique value which designates that this event is of a certain type. Use this property to categorise your events.

`in` - refers to the start time of the event (in milliseconds)

`out` - refers to the stop time of the event (in milliseconds)

`payload` - a user defined object

## Example use
In the following example, we will define 2 scenes.

The first scene will refer to the second scene via an event.

```json
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
          "group": "skipTo",
          "in": 5000,
          "out": 5000,
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
```
