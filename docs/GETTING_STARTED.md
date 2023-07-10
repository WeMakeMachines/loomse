# Getting Started

The following is a short guide to getting you started with LoomSE.

## Initialising

##### HTML
```html
<div id="loomse"></div>
``` 

If you're using build tools such as Webpack / Babel, you can import the minified LoomSE module via ES6. 

##### JavaScript
```js
import LoomSE from 'loomse';

const parent = document.getElementById('loomse');  
const loomSE = new LoomSE(parent);
```

> Currently the only options you can supply are the width / height constraints for the parent element. Not supplying this will force LoomSE to take by default 100% of the height and width of its parent.

Once you have your instance, you can interact with it via the [API](./API.md).

Assuming your story script file is prepared, the first thing you will want to do is supply it into LoomSE, via the `startScript()` method.
```js
fetch('story-script.json')
    .then((res) => res.json())
    .then((script) => {
        loomse.startScript(script);
    });
```

Once this is supplied, LoomSE will automatically process and begin playing your script, generating and loading where necessary the relevant video elements / files.

For more information about building your story script, see our guide to [building your story](./BUILDING_YOUR_STORY.md).

## Responding to events

LoomSE will broadcast any scene events via a custom event along its DOM element. To subscribe to these you will have to add an event listener for the `director:sceneevent` event.

LoomSE supplies 3 values to the event object, `group`, `action` and `payload`.

```js
loomse.el.addEventListener('director:sceneevent', ({ detail }) => {
    const { group, action, payload } = detail;
    console.log(group, action, payload)
});
```

The `group` and `payload` properties give values as specified in the initial story script object.

You can use these to program custom behaviours in your application, employing the LoomSE API where necessary.

In the following example we will skip to a specific scene, which we have supplied in the payload as the property `nextScene`:

```js
loomse.el.addEventListener('director:sceneevent', ({ detail }) => {
    const { group, action, payload } = detail;

    if (action !== 'start') {
        return;
    }
 
    if(group === 'skipTo') {
        loomse.skipTo(payload.nextScene);
    }
});
```
