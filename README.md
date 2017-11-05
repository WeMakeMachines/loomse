# Loom Story Engine 0.4.0
*Interactive storytelling for the modern web*

## Dependencies

Developing Loom requires npm, babel (for compiling ES6), sass and rollup for building.

A bult Loom project has no external dependencies.

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

## Writing your own extensions

Extensions can be written in `app-src/user/extensions.js`, inside the `userDefinedModules` namespace.

They must be written with 2 exposed return functions, `run(element, render)` and `stop()`. These are each called respectively during media playback at the in and out times set by the script.

run() is called with 2 arguments - `element` and `render`.

element - object reference to the the container in which the module will be posted
render - callback function which posts your event into the DOM

After `stop()` is run by the engine, the container for your module will also be removed from the DOM.

#### Example module

You can use the following structure to create your own modules:

```
const userDefinedModules = {

	myModule() {

		return {

			run(element, render) {

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

- `loomSE.currentTime()` - returns current time (in seconds)
- `loomSE.duration()` - returns duration of media (in seconds)
- `loomSE.pause()` - pause current media
- `loomSE.play(time)` - play current media
- `loomSE.duration()` - duration of current media
- `loomSE.seek(time)` - seek to time (in seconds) in media
- `loomSE.skip(scneName)` - skip to name of scene
- `loomSE.reload()` - reload current scene
- `loomSE.version` - show current version