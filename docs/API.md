# API  
Once you've created an instance of loom, you can use the following methods to communicate with the core application.

## Methods

#### currentDuration()  
> *returns Number*  
>
> current duration (in seconds)  

#### currentTime()
> *returns Number*
>  
> current time (in seconds)  

#### startScript(_scriptObject_: object)  
> *returns Promise*
>
> processes and runs a script story file

#### pause()  
> *returns Void*
>  
> pauses current media  
  
#### play()
> *returns Void*  
>
> plays current media  
  
#### reloadScene()  
> *returns Void*
>
> reloads the current scene  
  
#### resize(_width_: string, _height_: string)  
> *returns Void*
>  
> resizes the element  
  
#### skipTo(_sceneName_: string)  
> *returns Void*
>  
> loads the new scene

## Properties

#### el  
> *returns HTMLDomObject*
>
> The LoomSE element

#### version  
> *returns String*
>
> current version
  
## Events  
  
LoomSE broadcasts synthetic events along it's DOM object. To subscribe to these you can add an event listener to the LoomSE object.

#### director:sceneevent
This event fires for every custom scene event. Each custom scene event has a pair, which consists of a *START* and *STOP* action.

LoomSE supplies 3 properties on the detail property of the event object, `group`, `action` and `payload`.

###### group

This is the group to which the event belongs, as specified in the story script object

###### action

Specifies whether this is a `start` or `stop` action

###### payload

Any additional information supplied via the story script object