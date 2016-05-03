# Loom Story Engine
*Interactive storytelling for the modern web*

## Installation

Extract and deploy Loom to your web server, following the web servers 

## Configuration

Loom can be configured by changing the behavioural properties of the application, as well as extending the base functionality with custom modules.

## Behaviours

The behaviours file can be found and edited in `js/behaviours.json`. This file is in JSON format. Certain behaviours within the application can be edited from here.

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