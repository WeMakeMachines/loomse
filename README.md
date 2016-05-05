# Loom Story Engine
*Interactive storytelling for the modern web*

## Installation

Extract and deploy Loom to your web server, following the current file structure. If you wish to embed Loom into an existing webpage, make sure to insert the following HTML markup.

```
<div id="loomSE">
	<div id="loomSE_theatre">
		<div id="loomSE_stage">
			<div id="loomSE_overlay"></div>
			<div id="loomSE_mediaGroup">
		</div>
		</div>
	</div>
</div>

```

## Configuration & Behaviours

Loom can be configured by changing the behavioural properties of the application, as well as extending the base functionality with custom modules.

The behaviours file can be found and edited in `js/behaviours.json`. This file is in JSON format. Certain behaviours within the application can be controlled from here.

#### The Script

All the power for developing your non-linear narrative rests inside a JSON based script file. The default location for this is `assets/scripts/script-desktop.json`.

## Running the application

The function `loomSE.initialise()` must be called to start the Loom application. By default this sites inside `index.html`. Check the initialisation arguments are set correctly, using the following syntax:

`loomSE.initialise([*target*], [*script_url*], [*first_scene*], [*callback*]. [*resolution*])`

target - the node ID for which Loom will attach itself
script_url - the URL location of the script file
first_scene - the name of the first scene in the script to launch
callback - *optional* the function to run once Loom has prepared it's environment
resolution - *optional* a fixed resolution for all media playback

The default arguments are as follows;

```
loomSE.initialise('loomSE', 'assets/scripts/script-desktop.json', 'intro', function() {
    // callback
});
```

## Writing your own modules

Modules must be constructed under the Loom namespace `loomSE`, and as a prototype of the `Modules` constructor. They are written with 2 exposed return functions, `run()` and `stop()`. These are each called respectively during media playback at the in and out times set by the script. When `run()` is called, an object reference to the the container in which the module will be posted is passed via the argument `container`. You can append any custom elements to this container with vanilla JavaScript as follows `container.appendChild(yourElement)`. After `stop()` is run by the engine, the container for your module will also be removed from screen.

#### Example module

You can use the following structure to create your own modules, or see the live examples included inside `js/loom-modules.js`.

```
loomSE.Modules.prototype.myModule = function() {

    return {
        run: function(container) {
            
        },
        stop: function() {

        }
    }
};
```

## API

You can communicate with the core application with the Loom API.

Current API commands:

- `loomSE.currentTime()` - returns current time (in seconds)
- `loomSE.duration()` - returns duration of media (in seconds)
- `loomSE.control.pause()` - pause current media
- `loomSE.control.play(time)` - play current media
- `loomSE.control.duration()` - duration of current media
- `loomSE.control.scrub(time)` - seek to time (in seconds) in media
- `loomSE.control.reload()` - reload current scene