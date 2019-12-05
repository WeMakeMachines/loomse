  
# Loom Story Engine  
*Interactive storytelling for the modern web - create your script in Loom, tell multiple tales*  
  
## What is LoomSE?  
LoomSE is a client side HTML5 video and event manager. Events can be scheduled to fire during video playback, which your application can subscribe to and use. By interacting with the API you can then direct how the video should play, or even which video should play next.  
  
## Installation  
  
This repository includes a minified version of LoomSE `/dist/loomse.min.js`  
  
#### via npm ###  
  
>`npm install --save loomse`  
  
## Usage  
  
#### Importing  
  
The most common way of importing LoomSE into your project would be via an ES6 import,  
for example:  
  
>`import LoomSE from 'loomse'`  
  
#### Syntax  
  
>**_loomSE_ = new LoomSE(_parent_, _options_)**  
>  
>- `parent` a valid DOM element to which LoomSE will unpack itself  
>- `options` **| optional**  
>  - width: _number_  
>  - height: _number_  
>  
  
#### Example usage  
  
##### HTML  
  
>`<div id="loomSE"></div>`  
  
  
##### JavaScript  
>```  
>const parent = document.querySelector('#loomSE');  
>const loomSE = new LoomSE(parent, {  
>  width: 800,  
>  height: 600  
>});  
>```  
  
## The Story Script  
All the power for developing your non-linear narrative rests inside a JSON based script file.  
  
You can define separate scripts for mobile and desktop.  
  
Please refer to the [script schema](source/LoomSE/schemas/script.json).  
  
## API  
You can communicate with the core application with the Loom API.  
  
#### currentDuration()  
*returns Number*  
current duration (in seconds)  
  
#### currentTime()  
*returns Number*  
current time (in seconds)  

#### el  
*returns HTMLDomObject*  
The LoomSE element
  
#### loadScriptFromJson(_jsonObject_)  
*returns Promise*  
  
#### loadScriptFromUrl(_url_)  
*returns Promise*  
  
#### pause()  
*returns Void*  
pauses current media  
  
#### play()  
*returns Void*  
plays current media  
  
#### reloadScene()  
*returns Void*  
reloads the current scene  
  
#### resize()  
*returns Void*  
resizes the element  
  
#### skipTo()  
*returns Void*  
resizes the element  
  
#### version  
*returns String*  
current version  
  
## Events  
  
LoomSE broadcasts synthetic events along it's DOM object. To subscribe to these you can add an event listener to the LoomSE object.

#### director:sceneevent
This event fires for every custom scene event. Each custom scene event has a pair, which consists of a *START* and *STOP* action.
  
## Terminology  
  
##### Script  
Like the script in a play, a script is the blueprint for a story. Contains the story and metadata.  
  
##### Story  
A collection of scenes.  
  
##### Scene  
Part of a story.  
  
## Pronounciation  
_{ loom-see }_
