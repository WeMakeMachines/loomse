# Loom Story Engine
*Interactive storytelling for the modern web*

## What is LoomSE?
LoomSE is an open-source application built in JavaScript, HTML5 and CSS3. With Loom, content creators can tell interactive stories over the modern web. Create your script in Loom, tell multiple tales.

## Dependencies

#### Development dependencies
- npm
- babel (for compiling ES6)
- webpack (for building)

#### Production dependencies
- djv (for validating the script file)

## Installation

This repository includes a minified version of LoomSE `/dist/loomse.min.js`

#### via npm ###

`npm install --save loomse`

#### Importing

The most common way of importing LoomSE into your project would be via an ES6 import,
for example:

`import LoomSE from 'loomse'`

## Initialising and configuration

The LoomSE object must be initialised via the `new` keyword. For example;

`const loomSE = new LoomSE();`

#### LoomSE object syntax

_LoomSE(parent{HTMLElement}, initialParameters{Object})_

- `parent` refers to an object in the DOM to which the Loom Story application will unpack itself
- `initialParameters` refers the the initialisation parameters

#### Configuring

The initialParameters object is shaped as follows

- `script` (required) - Defines where the script file is located
- `mobileScript` - Defines the mobile script
- `externalModules` - Name of global object which contains all the modules
- `mobile` - Contains mobile specific properties
    - `minimumResolution` - Below this resolution the mobile script will be used
- `subtitles` - An object containing overrides for the subtitles mechanism
    - `active` - Indicates whether subtitles should be shown at start
    - `language` - Default selected language for the subtitles
    - `x` - x co-ordinate for the subtitles
    - `y` - y co-ordinate for the subtitles

#### Example usage

##### HTML
```
<div id="loomSE"></div>
```

##### JavaScript
```
var htmlElement = document.querySelector('#loomSE');
var config = {
    script: 'script.json'
    mobileScript 'script-mobile.json'
};
var loomSE = new LoomSE(htmlElement, config);

```

## The Story Script
All the power for developing your non-linear narrative rests inside a JSON based script file.

You can define separate scripts for mobile and desktop.

Please refer to the [script schema](source/LoomSE/schemas/script.json).

## External modules
Loom provides a framework for you to write your own modules.

Modules are namespaced to the global object specified in the config property `externalModules`.

Each module must have a publicly accessible interface. These are each called respectively during media playback at the
in and out times set by the script.

##### `run(payload, element, render)`

- `payload` contains event data set in the script
- `element` object reference to the the container in which the module will be posted
- `render` callback function which posts your event into the DOM

##### `stop()`

After `stop()` is run by the engine, the container for your module will also be removed from the DOM.

##### Example module
You can use the following structure to create your own modules:

```
loomSE_modules = {

    myModule: function() {

        return {
    
            run(payload, element, render) {
    
                console.log('event begins!');
    
                // do some stuff
    
                render();
            },
    
            stop() {
    
                console.log('closing!');
    
            }
    
        };
        
    }

};
```

## API
You can communicate with the core application with the Loom API.

Current API commands:

- `currentTime()` _{function}_ - returns current time (in seconds)
- `pause()` _{function}_ - pause current media
- `play(time)` _{function}_- play current media
- `skipTo(sceneName)` _{function}_ - skip to scene
- `reload()` _{function}_ - reload current scene
- `version` / `v` _{string}_ - show current version

## Terminology

##### Script
Like the script in a play, a script is the blueprint for a story.

##### Story
A collection of scenes.

##### Scene
Part of a story.
