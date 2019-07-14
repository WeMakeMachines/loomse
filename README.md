# Loom Story Engine 0.5.1
*Interactive storytelling for the modern web*

## What is Loom?
Loom is an open-source application built in JavaScript, HTML5 and CSS3. With Loom, content creators can tell interactive stories over the modern web. Create your script in Loom, tell multiple tales.

## Browser Compatibility ##

TODO

## Dependencies
### Development
Developing within the Loom framework requires
- npm
- babel (for compiling ES6)
- sass
- webpack (for building)

### Production
- Babel polyfill

## Installation
Download and run:

```
npm install

```
To build in development mode, run:

```
npm run dev

```

To build in production mode, run:

```
npm run prod

```

Built files are stored in the `app-build` directory.

## Configuration & Behaviours
Loom can be configured by changing the behavioural properties of the application, as well as extending the base functionality with extensions.

#### Application Behaviour
These files are in JSON format.

The configuration file `app-src/configs/config.json` controls some aspects of the application.
The behaviours file `app-src/configs/storyBehaviour.json` controls some of the finer aspects of the script.

#### The Script
All the power for developing your non-linear narrative rests inside a JSON based script file. The default location for this is `assets/scripts/`.

You can define separate scripts for mobile and desktop.

## Running the application
The function `loomSE.initialise()` must be called to start the Loom application. By default this sites inside `index.html`.

## Writing your own modules
Loom provides a framework for you to write your own modules.

Modules can be written in `app-src/user/userModules.js`.

Each module must have a publicly accessible interface. These are each called respectively during media playback at the
in and out times set by the script.

#### `run(payload, element, render)`

- `payload` contains event data set in the script
- `element` object reference to the the container in which the module will be posted
- `render` callback function which posts your event into the DOM

#### `stop()`

After `stop()` is run by the engine, the container for your module will also be removed from the DOM.

#### Example module
You can use the following structure to create your own modules:

```
myModule() {

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
```

## API
You can communicate with the core application with the Loom API.

Current API commands:

- `currentTime()` - returns current time (in seconds)
- `duration()` - returns duration of media (in seconds)
- `pause()` - pause current media
- `play(time)` - play current media
- `duration()` - duration of current media
- `seek(time)` - seek to time (in seconds) in media
- `skipTo(sceneName)` - skip to scene
- `reload()` - reload current scene
- `version` - show current version

## Terminology

##### Script
Like the script in a play, a script is the blueprint for a story.

##### Story
A collection of scenes.

##### Scene
Part of a story.
