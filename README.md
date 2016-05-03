# Loom Story Engine
> Interactive storytelling for the modern web

## Installation

Extract and deploy Loom to your server

## Development and configuration


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

#### In short...

- Modules can be placed in the Modules file `js/loom-modules.js`, or written in your own linked JavaScript file
- `run()` will execute at the time in point for your module during media playback
- `stop()` will execute at the time out point for your module during media playback