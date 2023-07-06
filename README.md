![Logo](./ASSETS/logo.png)

# Loom Story Engine
*Interactive storytelling for the modern web - create your script in Loom, tell multiple tales*

## What is LoomSE?
LoomSE is a client side HTML5 video and event manager. Events can be scheduled to fire during video playback, which your application can subscribe to and use. By interacting with the API you can then direct how the video should play, or even which video should play next.

### One script, multiple stories
With loomse, content creators can tell interactive stories over the modern web. Create your script in loomse, tell multiple tales.

## Installation
This repository includes a minified version of LoomSE `/dist/loomse.min.js`  

#### via npm ###
```
npm i loomse
```

## Usage
See our **[Getting Started Guide](DOCS/GETTING_STARTED.md)** for a more detailed introduction

#### Importing
ES6 module via default export

```js
import LoomSE from 'loomse';
```

#### Syntax  
```js
const loomSE = new LoomSE(element: HTMLElement[, options: object]);
```

##### element _(required)_
A valid DOM element to which LoomSE will unpack itself

##### options _(optional)_
An object. Valid keys:

- **width**: _string_ _(default: 100%)_
    
    width of the resulting video element

- **height**: _string_ _(default: 100%)_

    height of the resulting video element
 
#### Example usage  
  
##### HTML
```html
<div id="loomSE"></div>
``` 

##### JavaScript
```js
const parent = document.querySelector('#loomSE');  
const loomSE = new LoomSE(parent, {  
  width: "800px",  
  height: "600px"
});
```
## API
Visit the **[API](DOCS/API.md)** reference

## The Story Script
Use the provided **[template script](DOCS/script-template.json)**

Or look at the **[example script](DOCS/script-example.json)**

Or Learn how to **[build Your Story](DOCS/BUILDING_YOUR_STORY.md)**

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
