# Loomse

## Instance methods

### `currentDuration()`

#### Returns `number`

Returns the length of the current media track (in seconds)

### `currentEvents()`

#### Returns `scriptedEvent[]`

Returns a collection of events for the current scene

### `currentScene()`

#### Returns `string`

Returns the current scene name

### `currentTime()`

#### Returns `number`

Returns the time index of the current media (in seconds)

### `pause()`

Pauses the current media track

### `play()`

Plays the current media track

### `reloadScene()`

Reloads the current scene

### `registerPlugin(pluginProps)`

#### Parameters

`pluginProps` _PluginProps_

An object with some or all of the following properties:

> `name` _string_
> 
> The name of the plugin. Must be unique
> 
> `mount?` _object_ __(optional)__
> 
> Specifies the mount behaviour for the plugin
> 
> > `parentEl`: _HTMLElement_
> >
> > The parent container where the plugin will be mounted
> 
> > `el`: _HTMLElement_;
> >
> > The container for the plugin
> 
> > `onLoad?` _boolean_ __(optional)__
> >
> > Should the plugin be mounted when Loomse initialises?
> 
> > `persist?` _boolean_ __(optional)__
> >
> > Keeps the plugin mounted to the DOM
> 
> `hooks?` _object_ __(optional)__
> 
> > `run?` _function_ __(optional)__
> >
> > The callback which should execute when the plugin is called via an event
>
> > `cleanup?` _function_ __(optional)__
> >
> > The callback which should execute before unmounting the plugin

### `skipTo(sceneName)`

Skips to the named scene

#### Parameters

`sceneName` _string_

## Instance properties

### `el`

#### Returns `HTMLElement`

The root element where Loomse is registered
