![Logo](assets/logo.png)

# (Loom) (S)tory (E)ngine 
*Interactive storytelling for the modern web - create your script in Loom, tell multiple tales*

## What is LoomSE?
LoomSE is a client side HTML5 video and event manager. Events can be scheduled to fire during video playback, which your application can subscribe to and use. By interacting with the API you can then direct how the video should play, or even which video should play next.

### One script, multiple stories
With loomse, content creators can tell interactive stories over the modern web. Create your script in loomse, tell multiple tales.

## Quick start guide

```bash
npm i loomse
```

##### HTML
```html
<div id="loomse"></div>
``` 

Optionally, you can also import the styles into your project

```html
<link rel="stylesheet" href="node_modules/loomse/dist/styles.css" />
```

##### JavaScript
```js
(async () => {
    const response = await fetch("/story-script.json");
    const json = await response.json();
    const loomse = createStory(parent, json);
})();
```

To learn more about building a script, see [building your story](docs/BUILDING_YOUR_STORY.md)

## Dependencies

Under the hood, Loomse uses the [RE:DOM](https://redom.js.org) library to handle DOM interactions.

For parsing subtitle files, Loomse uses [Simple Subtitle Parser](https://github.com/WeMakeMachines/simple-subtitle-parser)

## API

Visit the **[API](docs/API/API.md)** reference

## Terminology
  
##### Script
Like the script in a play, a script is the blueprint for a story. Contains the story and metadata.  
  
##### Story
A collection of scenes
  
##### Scene
Part of a story

## The project
loomse is an engine for weaving stories together. Began by Franco Speziali in 2015, loomse was named in part as homage to the surrounding industrial history of Manchester, but also as a nod to the 1990 graphical adventure Loom.
  
## Pronunciation  
_{ loom-see }_
