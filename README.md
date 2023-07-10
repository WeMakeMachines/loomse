![Logo](assets/logo.png)

# Loom Story Engine
*Interactive storytelling for the modern web - create your script in Loom, tell multiple tales*

## What is LoomSE?
LoomSE is a client side HTML5 video and event manager. Events can be scheduled to fire during video playback, which your application can subscribe to and use. By interacting with the API you can then direct how the video should play, or even which video should play next.

### One script, multiple stories
With loomse, content creators can tell interactive stories over the modern web. Create your script in loomse, tell multiple tales.

## Installation
This repository includes multiple minified versions of LoomSE
- `/dist/loomse.min.js` - UMD definition. Suitable for browsers
- `/dist/loomse.e.min.js` - ES module, for usage with modules

#### via npm ###
```
npm i loomse
```

## Usage
See our **[Getting Started Guide](docs/GETTING_STARTED.md)** for a more detailed introduction

#### Example usage  
  
##### HTML
```html
<div id="loomse"></div>
``` 

##### JavaScript
```js
const parent = document.getElementById('loomse');  
const loomSE = new LoomSE(parent, {  
  width: "800px",  
  height: "600px"
});
```

## API
Visit the **[API](docs/API.md)** reference

## The Story Script
Use the provided **[template script](docs/script-template.json)**

Or look at the **[example script](docs/script-example.json)**

Or Learn how to **[build Your Story](docs/BUILDING_YOUR_STORY.md)**

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
