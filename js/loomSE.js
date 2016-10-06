//
// Loom Story Engine
//
// " trust in code "
//

var loomSE = (function() {

    //
    // Private
    //

    // Variables used by the entire app
    var behaviour = {},
        status = {
            version: '0.4'
        },
        script,
        currentScene,
        applicationId = 'loomSE',
        modules;

    // Generic functions which are commonly used within the application
    var helper = {
        ajaxRequest: function(file, fileType, async, callback) {
            var data,
                xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState === 4) {
                    if(xmlhttp.status === 200) {
                        if(fileType === 'JSON'){
                            data = JSON.parse(xmlhttp.responseText);
                        }
                        else {
                            data = xmlhttp.responseText;
                        }
                        callback(data);
                    }
                    else {
                        callback(false);
                    }
                }
            };

            xmlhttp.open('GET', file, async);
            xmlhttp.send();
        },

        report: function(message) {
            // display report
            console.log(message);
        },

        displayError: function(errorMessage) {
            var errorText = '\n*** Error ***\n';
            // throw an exception
            throw errorText + errorMessage;
            //console.log(errorText + errorMessage);
        },

        random: function(minRange, maxRange) {
            if(typeof minRange === 'undefined') {
                minRange = 0;
            }
            var range = maxRange - minRange;
            if(range <= 0){
                range = maxRange;
                minRange = 0;
            }
            // returns a random number between 1 and number
            return Math.floor(Math.random() * range) + minRange;
        },

        cleanString: function(string) {
            // removes whitespace, and converts to lowercase
            return string.replace(/\s+/g, '').toLowerCase();
        },

        newDOMobject: function(parent, type, id, cssClass, cssProperties) {

            var newObject = document.createElement(type),
                newObjectId = applicationId + '_' + id;

            if(parent) {
                parent.appendChild(newObject);
            }

            if(id) {
                newObject.setAttribute('id', newObjectId);
            }

            if(cssClass) {
                newObject.setAttribute('class', cssClass);
            }

            if(cssProperties) {
                css.style(newObject, cssProperties); // test for bug here with the reference
            }

            return newObject;
        },
        
        newElement: function(type, id, cssClass, style) {
            var object = document.createElement(type),
                objectId = applicationId + '_' + id;

            if(id) {
                object.setAttribute('id', objectId);
            }

            if(cssClass) {
                object.setAttribute('class', cssClass);
            }

            if(style) {
                css.style(object, style); // test for bug here with the reference
            }

            return object;
        },

        // turns seconds into hours, minutes, seconds
        clock: function(timeInSeconds) {
            var remainder = timeInSeconds,
                hours,
                minutes,
                seconds,
                split;

            // find how many hours there are
            if(remainder >= 3600) {
                hours = Math.floor(remainder / 3600);
                remainder = remainder - (hours * 3600);
            }
            else {
                hours = 0;
            }

            // find how many minutes there are
            if(remainder >= 60) {
                minutes = Math.floor(remainder / 60);
                remainder = remainder - (minutes * 60);
            }
            else {
                minutes = 0;
            }

            // find how many seconds
            if(remainder >= 1) {
                seconds = Math.floor(remainder);
                remainder = remainder - seconds;
            }
            else {
                seconds = 0;
            }

            split = remainder.toString();

            if(split === '0') {
                split = '000';
            }
            else {
                split = split.substr(2,3);
            }

            function addLeadingZero(number) {
                if(number < 10) {
                    number = '0' + number;
                }

                return number;
            }

            return {
                hours: addLeadingZero(hours),
                minutes: addLeadingZero(minutes),
                seconds: addLeadingZero(seconds),
                split: split
            };
        }
    };

    // A short library to help with CSS styling and animations
    var css = (function() {

        return {
            style: function(DOMobject, cssProperties) {
                for(var attribute in cssProperties)
                {
                    if(cssProperties.hasOwnProperty(attribute)) {
                        var value = cssProperties[attribute];

                        if(attribute === 'width' || attribute === 'height'  || attribute === 'top' || attribute === 'left' || attribute === 'right' || attribute === 'bottom') {
                            value = value + 'px';
                        }

                        DOMobject.style[attribute] = value;
                    }
                }
            },

            animate: function(DOMobject, parameter, startValue, endValue, time, callback, steps) {
                var currentValue,
                    numberOfSteps,
                    currentStep,
                    difference,
                    timeStep,
                    valueStep,
                    styles = {},
                    step;

                if(typeof steps !== 'number') {
                    steps = 4; // the more steps the smoother the animation, default is 4
                }

                //numberOfSteps = steps;
                currentStep = 0;
                difference = endValue - startValue;
                timeStep = time / steps;
                valueStep = difference / steps;
                step = setInterval(function() {
                    if(currentStep > steps) {
                        clearInterval(step);
                        if(callback) {
                            callback();
                        }
                    } else {
                        if(currentStep === steps) {
                            currentValue = endValue;
                        } else {
                            currentValue = startValue + (valueStep * currentStep);
                        }
                        styles[parameter] = currentValue;
                        css.style(DOMobject, styles);
                        currentStep = currentStep + 1;
                    }
                }, timeStep);
                return step;
            },

            interrupt: function(interval) {
                clearInterval(interval);
            }
        };
    })();

    // Generates and handles the graphical user interface for our media player
    var gui = (function() {

        var id = 'gui',
            container = helper.newDOMobject(undefined, 'div', id),
            shadow = helper.newDOMobject(container, 'div', 'gui_shadow'),
            btnGroup = helper.newDOMobject(container, 'div', 'btnGroup'),
            timeGroup = helper.newDOMobject(container, 'div', 'timeGroup'),

            btnGroupLeft = helper.newDOMobject(btnGroup, 'div', 'btnGroupLeft'),
            btnGroupRight = helper.newDOMobject(btnGroup, 'div', 'btnGroupRight'),
            timeElapsed = helper.newDOMobject(timeGroup, 'div', 'time_elapsed'),
            timeDuration = helper.newDOMobject(timeGroup, 'div', 'time_duration'),
            timeSlider = helper.newDOMobject(timeGroup, 'div', 'time_timeSlider'),

            btnPlayPause = new GuiComponent('div', 'btn_playPause', 'btn_sprite', ['pause', 'play']),
            btnRewind = new GuiComponent('div', 'btn_rewind', 'btn_sprite'),
            btnFForward = new GuiComponent('div', 'btn_fforward', 'btn_sprite'),
            btnSkip = new GuiComponent('div', 'btn_skip', 'btn_sprite'),
            btnVolume = new GuiComponent('div', 'btn_volume', 'btn_sprite', ['high', 'off', 'medium']),
            btnSubtitles = new GuiComponent('div', 'btn_subtitles', 'btn_sprite', ['on', 'off']),
            btnShare = new GuiComponent('div', 'btn_share', 'btn_sprite'),
            btnFullscreen = new GuiComponent('div', 'btn_fullscreen', 'btn_sprite'),

            scale; // gui scale - 1 small, 2 medium, 3 large

        function appendButtonComponents() {

            btnGroupLeft.appendChild(btnPlayPause.element);
            btnGroupLeft.appendChild(btnRewind.element);
            btnGroupLeft.appendChild(btnFForward.element);
            btnGroupLeft.appendChild(btnSkip.element);

            btnGroupRight.appendChild(btnVolume.element);
            btnGroupRight.appendChild(btnSubtitles.element);
            btnGroupRight.appendChild(btnShare.element);
            btnGroupRight.appendChild(btnFullscreen.element);
        }

        function GuiComponent(type, id, cssClass, states, mouseOver, mouseOut) {
            this.element = helper.newElement(type, id, cssClass);

            this.element.loomSE = {};

            if(mouseOver) {
                this.element.mouseOverEvent = function() {
                    mouseOver.call(this);
                };
            }

            if(mouseOut) {
                this.element.mouseOutEvent = function() {
                    mouseOut.call(this);
                };
            }

            // states
            if(states) {
                this.element.states = states;
                this.element.currentStateIndex = 0;
                this.element.currentState = states[0];

                this.element.changeState = function() {
                    // cycle through states
                    var states = this.states,
                        currentStateIndex = this.currentStateIndex;

                    if(currentStateIndex === states.length - 1) {
                        this.currentStateIndex = 0;
                    }
                    else {
                        this.currentStateIndex+=1;
                    }
                    this.currentState = states[this.currentStateIndex];
                };
            }
        }

        btnPlayPause.element.clickEvent = function() {

            if(this.currentState === 'play') {
                media.pause();
                this.classList.add('btn_play');
                this.classList.remove('btn_pause');
            }
            if(this.currentState === 'pause') {
                media.play();
                this.classList.remove('btn_play');
                this.classList.add('btn_pause');
            }

            this.changeState();
        };

        btnRewind.element.clickEvent = function() {
            media.play(0.1);
            subtitles.reset(0);
        };

        btnFForward.element.clickEvent = function() {
            if(media.object.paused === false) {
                var time = media.getCurrentTime() + behaviour.media.fastForwardSkip;

                if(time <  media.getLength()) {
                    media.play(time);
                    subtitles.reset(time);
                }
            }
        };

        btnVolume.element.clickEvent = function() {

            if(this.currentState === 'high') {
                this.classList.remove('btn_vol_high');
                this.classList.remove('btn_vol_med');
                this.classList.add('btn_vol_off');
            }
            if(this.currentState === 'medium') {
                this.classList.remove('btn_vol_med');
                this.classList.remove('btn_vol_off');
                this.classList.add('btn_vol_high');
            }
            if(this.currentState === 'off') {
                this.classList.remove('btn_vol_high');
                this.classList.remove('btn_vol_off');
                this.classList.add('btn_vol_med');
            }

            this.changeState();
        };

        btnSubtitles.element.clickEvent = function() {

            if(this.currentState === 'on') {
                subtitles.off();
                this.classList.remove('btn_sub_on');
                this.classList.add('btn_sub_off');
            }
            if(this.currentState === 'off') {
                subtitles.on();
                this.classList.remove('btn_sub_off');
                this.classList.add('btn_sub_on');
            }

            this.changeState();
        };

        function updateProgressBar() {
            var getDuration = media.getLength(),
                getCurrentTime = media.getCurrentTime(),
                duration = helper.clock(getDuration),
                currentTime = helper.clock(getCurrentTime),
                maxWidth = container.offsetWidth,
                progressWidth = (getCurrentTime / getDuration) * maxWidth;

            function formatTime(object) {
                var timeContainer = document.createElement('div'),
                    timeHours = helper.newElement('span', undefined, 'hour'),
                    timeMinutes = helper.newElement('span', undefined, 'minute'),
                    timeSeconds = helper.newElement('span', undefined, 'second'),
                    dividerHours = document.createElement('span'),
                    dividerMinutes = document.createElement('span');

                dividerHours.innerHTML = ':';
                dividerMinutes.innerHTML = ':';

                timeHours.innerHTML = object.hours;
                timeContainer.appendChild(timeHours);
                timeContainer.appendChild(dividerHours);

                timeMinutes.innerHTML = object.minutes;
                timeContainer.appendChild(timeMinutes);
                timeContainer.appendChild(dividerMinutes);

                timeSeconds.innerHTML = object.seconds;
                timeContainer.appendChild(timeSeconds);

                return timeContainer;
            }

            while (timeElapsed.firstChild) {
                timeElapsed.removeChild(timeElapsed.firstChild);
            }
            while (timeDuration.firstChild) {
                timeDuration.removeChild(timeDuration.firstChild);
            }

            timeElapsed.appendChild(formatTime(currentTime));
            timeDuration.appendChild(formatTime(duration));

            css.style(timeSlider, {
                width: progressWidth
            });
        }

        function load() {
            appendButtonComponents();
            updateProgressBar();
            environment.containers.root.appendChild(container);
        }

        function unload() {
            environment.containers.root.removeChild(container);
        }

        function listenForEvents() {

            function listenToChildren(array) {
                if(typeof array.length === 'number') {
                    for(var i=0; i < array.length; i+=1) {

                        var currentChild = array[i];

                        if(currentChild.mouseOverEvent) {

                            // hover events
                            currentChild.addEventListener('mouseover', function() {
                                this.mouseOverEvent();
                            });

                            array[i].addEventListener('mouseout', function() {
                                this.mouseOutEvent();
                            });
                        }

                        if(currentChild.clickEvent) {
                            currentChild.addEventListener('click', function() {

                                this.clickEvent();
                            });
                        }
                    }
                }
            }
            
            // listen to children for clicks and hover

            listenToChildren(btnGroupLeft.children);
            listenToChildren(btnGroupRight.children);
        }

        return {
            load: function() {
                load();
                listenForEvents();
            },

            unload: function() {
                unload();
            },

            updateProgressBar: updateProgressBar
        };
    })();

    // Handles the fullscreen API
    var fullScreen = (function() {

        var state;

        function toggle() {
            console.log('Not implemented yet');
        }

        return {
            toggle: toggle,
            state: state
        };
    })();

    var environment = (function() {
        var containers = {},
            resolution = {
                width: null,
                height: null
            },
            scaleTo;

        function getClientDimensions() {
            resolution.width = document.documentElement.clientWidth;
            resolution.height = document.documentElement.clientHeight;
            console.log(document.documentElement.clientWidth);
        }

        function initialise(DOMroot, expectedResolution) {
            // sets up the DOM environment for our app
            containers.root = document.getElementById(DOMroot);
            containers.stage = helper.newDOMobject(containers.root, 'div', 'stage');
            containers.overlay = helper.newDOMobject(containers.stage, 'div', 'overlay');
            containers.mediaGroup = helper.newDOMobject(containers.stage, 'div', 'mediaGroup');
            containers.events = helper.newDOMobject(containers.overlay, 'div', 'events');
            containers.subtitles = helper.newDOMobject(containers.overlay, 'div', 'subtitles');

            if(typeof expectedResolution === 'object' && typeof expectedResolution.width === 'number' && typeof expectedResolution.height === 'number') {
                // if the resolution has been defined, we use the numbers given
                scaleTo = 'fixed';
                resolution.width = expectedResolution.width;
                resolution.height = expectedResolution.height;
            }
            else {
                scaleTo = 'responsive';
                getClientDimensions();
                setResizeListener();
            }

            resizeContainers();
        }

        function resizeContainers() {
            for(var container in containers) {
                if(containers.hasOwnProperty(container)) {

                    css.style(containers[container], {
                        width: resolution.width,
                        height: resolution.height
                    });
                }
            }
        }

        function repositionEvents() {
            var activeEvents = environment.containers.events.children;
            if(activeEvents.length > 0) {
                for(var i=0; i<activeEvents.length; i+=1) {
                    if(typeof activeEvents[i].loomSE.position === 'function') {
                        activeEvents[i].loomSE.resolution.width = resolution.width;
                        activeEvents[i].loomSE.resolution.height = resolution.height;
                        activeEvents[i].loomSE.position();
                    }
                }
            }
        }

        function setResizeListener() {
            window.addEventListener("resize", function() {
                getClientDimensions();
                resizeContainers();
                repositionEvents();
                notify.resize();
            });
        }

        return  {
            initialise: initialise,
            containers: containers,
            resolution: resolution
        };
    })();

    // Keeps a record of the scenes passed through by the user and provides some control over how to navigate the history
    var history = (function() {
        var scenes = [];
        return {
            record: function(object) {
                // records scene
                scenes.push(object);
            },

            erase: function() {
                // removes scene

            },

            remind: function() {
                // returns current scene
                return scenes[scenes.length-1];
            },

            rewind: function() {
                // goes back 1 scene & erases current scene
                var scene;
                if(scenes.length > 1){
                    scenes.splice(scenes.length-1, 1);
                }
                scene = scenes[scenes.length-1];
                return scene;
            },

            saveToLocalStorage: function() {
                // save to html5 local storage
            }
        };
    })();

    // Handles the script logic
    var readScript = (function() {

        // --
        // A collection of methods that set process the media elements in the Script
        // --

        // Constructor function that creates instances of each scene
        var Scene = function(title, language, assets) {
            var that = this;
            this.title = title;
            this.shortName = assets.short_name;
            this.longName = assets.long_name;
            this.sceneId = helper.cleanString(this.title);
            this.media = assets.media;
            this.subtitles = assets.media.subtitles[language];
            this.events = assets.events;
            this.container = (function() {
                var element = document.createElement('div');
                element.setAttribute('id', that.sceneId);
                element.media = that.media.type;
                return element;
            })();
        };

        function process(scene) {
            // --
            // Processes the current scene
            // --
            // Each scene is composed of a 'media' type, which in turn has 'data' and 'parameters'
            // Each 'media' type also has a number of events

            media.create(scene.container, scene.media, function(playObject) {

                media.object = playObject;
                // check which media needs to play
                // play video
                if(scene.media.type === 'video') { // TODO need to allow this to accept and process multiple strings
                    //scene.media.video.duration = playObject.duration;

                    // check if video SHOULD autoplay
                    if(media.object.loomSE_parameters.autoplay === true) {
                        media.play();
                        // environment.resolution.video.height = media.object.videoHeight;
                        // environment.resolution.video.height = media.object.videoWidth;
                    }

                    //if(playObject.loop === false && (scene.data.nextSceneByDefault !== null || scene.data.nextnextSceneByDefault !== '')){
                    //    playObject.onended = function(e){
                    //        readScript.setScene(scene.data.nextSceneByDefault);
                    //    };
                    //}

                    // video loop logic must stay here

                    if(media.object.loomSE_parameters.loop === true) {
                        if(media.object.loomSE_parameters.loopIn === 0 && media.object.loomSE_parameters.loopOut === null) {
                            media.object.onended = function(e){
                                console.log('Looping from end to beginning');
                                environment.reset();
                                events.reset();
                                media.play(0);
                            };
                        }
                        else {
                            console.log('Im going to loop the video from the in and out points defined');
                            // add loop point as event
                            // for the purposes of our system, in / out points are reversed
                            // (schedule in point is actually loop out point etc)
                            currentScene.events.push(
                                {
                                    call: 'loop',
                                    schedule: {
                                        in: media.object.loomSE_parameters.loopOut,
                                        out: media.object.loomSE_parameters.loopIn
                                    }
                                }
                            );
                        }
                    }
                }

                if(scene.events !== null) {
                    events.schedule(media.object, scene.events, function() {
                    });
                }
                else {
                    helper.report('[Events] No events in scene.');
                }
            });
        }

        function setScene(scriptObject, scene) {
            // --
            // Runs when a new scene is set from the Script
            // Pulls the relevant scene details from the object, resets parameters and launches the process() method.
            // --

            currentScene = new Scene(scene, scriptObject.settings.language, scriptObject.scenes[scene]);

            //check if subtitles should be on
            if(script.settings.subtitles === true) {
                subtitles.on();
            }
            else {
                subtitles.off();
            }
            subtitles.parse(currentScene.subtitles);

            history.record(currentScene);
            process(currentScene);
        }

        return {
            setScene: setScene
        };
    })();

    // Handles all the logic for the scene events, for example we handle the schedule for each event here
    var events = (function() {
        var eventQueue = [];

        // Constructor function that creates instances of each event
        var Event = function(id, call, ignored, schedule, parameters) {

            //check if the module reference exists as a function
            if(typeof modules[call] === 'function') {
                var callModule = modules[call]();
            }

            if(ignored === true) {
                this.state = 'ignored';
            }
            else {
                this.state = 'waiting';
            }

            this.id = id; // event id
            this.call = call;
            this.state = 'waiting'; // waiting, fired, expired
            this.in = schedule.in / 1000;
            this.out = schedule.out / 1000;
            this.parameters = parameters;
            this.class = parameters.class;
            this.container = helper.newElement('div', id, this.class);
            this.container.loomSE = {
                resolution: {
                    width: environment.resolution.width,
                    height: environment.resolution.height
                },
                parameters: this.parameters,
                schedule: {
                    in: this.in,
                    out: this.out
                }
            };
            this.container.loomSE.parameters.id = this.id;
            if(typeof this.parameters.x === 'number' && typeof this.parameters.y === 'number') {
                this.container.loomSE.position = function() {

                    // using a co-ordinate system of %, place objects on screen
                    var translatedCoords = {
                            x: this.resolution.width / 100 * this.parameters.x,
                            y: this.resolution.height / 100 * this.parameters.y
                        },
                        thisObject = document.getElementById('loomSE_' + this.parameters.id);
                    thisObject.setAttribute('style', 'position: absolute; left: ' + translatedCoords.x + 'px; ' + 'top: ' + translatedCoords.y + 'px');
                };
            }
            // runs at beginning of event (in time)
            this.run = function() {
                if(this.state === 'waiting') {
                    this.state = 'fired';
                    environment.containers.events.appendChild(this.container);
                    callModule.run(this.container, {in: this.in, out:this.out}, this.parameters);
                }
            };
            // runs when the event has expired (out time)
            this.stop = function() {
                if(this.state === 'fired') {
                    this.state = 'expired';
                    environment.containers.events.removeChild(this.container);
                }
            };
            this.kill = function(callback) {
                if(this.container.firstChild) {
                    this.container.removeChild(this.container.firstChild);
                }
                else {
                    callback();
                }
            };
        };

        function schedule(target, array, callback) {
            // --
            // Schedules timed events for each media element
            // --

            for(var i=0; i < array.length; i+=1){
                var event = array[i],
                    id = event.call + '_' + i;

                eventQueue[i] = new Event(id, event.call, event.ignored, event.schedule, event.parameters);

                Event.prototype.schedule = function () {

                    // We calculate the ins and outs here
                    var that = this,
                        timeIn = that.in,
                        timeOut = that.out,
                        timeInLow = timeIn - (behaviour.media.timeEventResolution / 2),
                        timeInHigh = timeIn + (behaviour.media.timeEventResolution / 2),
                        timeOutLow = timeOut - (behaviour.media.timeEventResolution / 2),
                        timeOutHigh = timeOut + (behaviour.media.timeEventResolution / 2);

                    media.listen(function(time) {
                        if(time >= timeInLow && time <= timeInHigh){
                            if(behaviour.developer.verbose === 'full') {
                                helper.report('[Event] Run: ' + id);
                                helper.report('[Event] ' + 'T:' + time + ', L:' + timeInLow + ', H:' + timeInHigh);
                            }

                            that.run();
                        }
                        // 'Out'
                        if(time >= timeOutLow && time <= timeOutHigh) {
                            if(behaviour.developer.verbose === 'full') {
                                helper.report('[Event] Stop: ' + id);
                                helper.report('[Event] ' + 'T:' + time + ', L:' + timeOutLow + ', H:' + timeOutHigh);
                            }

                            that.stop();
                        }
                    });
                };


                eventQueue[i].schedule();
            }

            callback();
        }

        function reset() {
            for(var i=0; i < eventQueue.length; i+=1){
                eventQueue[i].state = 'waiting';
            }
        }

        function show() {
            console.log(eventQueue);
        }

        function killAll(callback) {
            for(var i=0; i < eventQueue.length; i+=1) {
                eventQueue[i].kill(callback);
            }
        }

        return {
            schedule: schedule,
            reset: reset,
            killAll: killAll
        };
    })();

    // Subtitles handling and rendering
    // Since subtitles appear in a linear fashion (the next one always follows the previous one),
    // we always keep on record the current subtitle to be displayed
    var subtitles = (function() {
        var id = 'subtitle',
            container = document.createElement('div'),
            element = document.createElement('p'),
            isActive, // boolean which determines whether subtitles are on or off
            subtitlesArray = [], // our array which holds all of the subtitles
            arrayPosition = 0,
            activeTitle = [0, 0, null, false]; // the active title which we've pulled out of the array

        // this function parses the subtitle file
        function parse(url) {
            var rawSubs;

            // convert a string into an internal time our application can understand
            function convertToInternalTime(string, h, m, s, ms) {
                var hours = Number(string.slice(h[0], h[1])),
                    minutes = Number(string.slice(m[0], m[1])),
                    seconds = Number(string.slice(s[0], s[1])),
                    milliseconds = Number(string.slice(ms[0], ms[1])) / 1000;

                return (hours * 3600) + (minutes * 60) + seconds + milliseconds;
            }

            // support for .srt files
            function srt(array) {
                var arrayPush = [],
                    currentRecord,
                    times,
                    timeIn,
                    timeOut,
                    string = '';

                for(var i=0; i < array.length; i+=1) {
                    currentRecord = array[i];
                    if(isNaN(currentRecord) === false) {
                        // push old string to array
                        if(i > 0) {
                            arrayPush = [timeIn, timeOut, string];
                            subtitlesArray.push(arrayPush);
                            string = '';
                        }
                        // skip to next line, we're expecting the times now
                        times = array[i+1];
                        timeIn = (function() {
                            var string = times.slice(0,12);

                            return convertToInternalTime(string, [0,2], [3,5], [6,8], [9,12]);
                        }());
                        timeOut = (function() {
                            var string = times.slice(17,29);

                            return convertToInternalTime(string, [0,2], [3,5], [6,8], [9,12]);
                        }());
                        i+=1;
                    }
                    else {
                        string = string + ' ' + currentRecord;
                    }
                }
            }

            // Pull the data from the subtitles file, and also determine what type of file we need to parse
            helper.ajaxRequest(url, null, true, function(data) {
                if(data !== false) {
                    rawSubs = data.match(/[^\r\n]+/g);
                    // check the ending characters of the url to determine the type of file
                    if(url.endsWith('srt')) {
                        srt(rawSubs);
                    }
                }
                else {
                    isActive = false;
                    if(behaviour.developer.verbose === 'subtitles') {
                        helper.report('[Subtitle] No valid subtitles found');
                    }
                }
            });
        }

        // The main function we will call
        // Here we check the current subtitle record against the current media time and
        // determine whether the subtitle is ready to be displayed, or if it ready to be removed
        function check(time) {
            // Check if subtitles are active, and if so check if a subtitle is currently displayed
            if(isActive === true && activeTitle[3] === false) {
                var check = subtitlesArray[arrayPosition]; // pull current record and see if it is ready
                if(check[0] === time || check[0] < time) {

                    // check if preceding subtitle still exists, if it does, remove it
                    if(activeTitle[3] === true) {
                        remove();
                    }

                    activeTitle = check;
                    activeTitle[3] = true; // set visibility flag to true
                    display(activeTitle[2]); // display subtitle
                    arrayPosition+=1;
                }
            }
            else {
                // We assume a title is already displayed, so we check if it has expired yet
                if(activeTitle[3] === true && activeTitle[1] < time) {
                    remove();
                }
            }
        }

        // Append our subtitle to the DOM
        function display(phrase) {
            if(isActive === true) {
                if(behaviour.developer.verbose === 'subtitles') {
                    helper.report('[Subtitle] ' + phrase);
                }
                element.innerHTML = phrase;
                environment.containers.subtitles.appendChild(container);
                container.appendChild(element);
            }
        }

        // Removes a subtitle
        // If no time is specified, the function defaults to removing the current existing subtitle
        function remove(time) {
            function destroy() {
                if(activeTitle[3] === true){
                    activeTitle[3] = false;
                    environment.containers.subtitles.removeChild(container);
                }
            }

            // Check if time is defined
            if(time) {
                if((activeTitle[1] === time || activeTitle[1] < time) && activeTitle[3] === true) {
                    destroy();
                }
            }
            else {
                destroy();
            }
        }

        // Sometimes the media player will have been forced to move further ahead
        // or behind than what we are expecting, throwing our subtitles out of sync.
        // If that is the case, this function will rectify the situation by finding where the
        // current position should be in the array.
        function reset(time) {
            remove();
            if(typeof time === 'number' && time !== 0) {
                // find the next subtitle with the timecode
                for(i=0; i<(subtitlesArray.length-1); i+=1) {
                    var currentRecord = subtitlesArray[i];
                    if(time < currentRecord[0]) {
                        arrayPosition = i;
                        break;
                    }
                }
            }
            else {
                arrayPosition = 0;
            }
        }

        return {
            parse: parse, // parse subtitle file
            check: check, // check if next subtitle is ready to be displayed
            display: display, // show the subtitle
            remove: remove, // remove existing subtitle
            reset: reset, // reset subtitles (fixes to current time index)
            on: function() {
                reset(media.object.currentTime);
                isActive = true;
            },
            off: function() {
                remove();
                isActive = false;
            }
        };
    })();

    // Handles all our media object and requests
    var media = (function() {

        var object = {};

        // internal watcher to keep track of the current time - if it stops, we know then that playback has been interrupted
        var poll = (function() {
            var pollEvent,
                pollInterval = 300,
                playbackStopEvents = 0,
                playBackStopState = false;

            return {
                run: function(object) {
                    var oldTime = object.currentTime,
                        newTime;

                    pollEvent = setInterval(function() {
                        newTime = object.currentTime;
                        // perform analysis
                        if(oldTime !== newTime) {
                            // all ok
                            if(playBackStopState === true) {
                                playBackStopState = false;
                                notify.dismiss();
                            }
                            oldTime = newTime;
                        }
                        else {
                            // else do this if playback has stopped
                            if(behaviour.developer.verbose === 'full' || behaviour.developer.verbose === 'minimal') {
                                console.log('[Poll] Video has stopped playing.');
                            }
                            if(playBackStopState === false) { // check if it hasn't stopped before
                                if(behaviour.developer.verbose === 'full' || behaviour.developer.verbose === 'minimal') {
                                    console.log('[Poll] This is the first time the video has stopped without user input.');
                                }
                                playbackStopEvents = playbackStopEvents + 1;
                            }
                            playBackStopState = true;
                            notify.push('Buffering');
                        }
                    }, pollInterval);
                },
                end: function() {
                    clearInterval(pollEvent);
                }
            };
        })();

        // external functions and variables

        function target(sceneId) {
            var parent = document.getElementById(sceneId),
                media = parent.media,
                selection;
            switch (media) {
                case 'video':
                    selection = document.querySelector('video');
                    break;
                case 'audio':
                    selection = document.querySelector('audio');
                    break;
                default:
                    break;
            }
            return selection;
        }

        function pause() {
            if(object.paused === false) {
                poll.end();
                object.pause();
                notify.push('Paused', 'paused');
            }
        }

        function play(timecode) {
            poll.end();
            notify.dismiss();
            // check if a timecode has been specified, and if it is within range
            if(timecode && timecode > 0 && timecode < object.duration) {
                object.currentTime = timecode;
            }
            object.play();
            poll.run(object);

            // everytime the timecode changes, the following series of actions are taken:
            //  - check to see if any subtitle needs displaying
            //  - check to see if a scene event needs to be fired
            //  - update progress bar
            object.ontimeupdate = function() {
                // I begin my watch...
                subtitles.check(object.currentTime);
                gui.updateProgressBar();
            };
        }
        
        function listen(callback) {
            // add an event listener

            object.addEventListener('timeupdate', function() {
                callback(object.currentTime);
            });
        }

        function create(container, media, callback) {
            // --
            // Creates a media object and posts to DOM
            // --

            var Audio = function() {
                // TODO

                return;
            };

            var Graphic = function() {
                
            };

            var Video = function() {
                // --
                // Create video element for screen
                // --

                var element = document.createElement('video'),
                    child1 = document.createElement('source'),
                    child2 = document.createElement('source'),
                    dimensions = calcVideoSize(media.video.width, media.video.height, environment.resolution.width, environment.resolution.height);

                element.setAttribute('width', dimensions.width);
                element.setAttribute('height', dimensions.height);
                element.setAttribute('id', applicationId + '_video');

                console.log(dimensions);

                if(typeof media.video.ogg === 'string') {
                    child1.setAttribute('src', media.video.ogg);
                    child1.setAttribute('type', 'video/ogg');
                    element.appendChild(child1);
                }

                if(typeof media.video.mp4 === 'string') {
                    child2.setAttribute('src', media.video.mp4);
                    child2.setAttribute('type', 'video/mp4');
                    element.appendChild(child2);
                }

                if(media.video.poster !== null) {
                    element.setAttribute('poster', media.video.poster);
                }

                element.loomSE_parameters = {};

                if(media.video.muted === true) {
                    element.muted = true;
                }

                // overrides any previous settings
                if(behaviour.developer.mute === true) {
                    element.muted = true;
                }

                if(media.video.controls === true) {
                    element.controls = true;
                }

                if(media.video.autoplay === true) {
                    element.loomSE_parameters.autoplay = true;
                }

                if(media.video.loop === true) {
                    element.loomSE_parameters.loop = true;

                    // check if loop in is a number, if it isn't set in point to 0 by default
                    if(typeof media.video.loop_in === 'number') {
                        element.loomSE_parameters.loopIn = media.video.loop_in;
                    } else {
                        element.loomSE_parameters.loopIn = 0;
                    }

                    // check if loop out is a number, if it isn't, default to null
                    if(typeof media.video.loop_out === 'number') {
                        element.loomSE_parameters.loopOut = media.video.loop_out;
                    } else {
                        element.loomSE_parameters.loopOut = null;
                    }
                }

                return element;
            };

            environment.containers.mediaGroup.appendChild(container);

            if(!callback){
                throw 'Expected callback';
            }

            if(media.type === 'audio') {
                callback(audio());
            }
            else if(media.type === 'video') {
                object = new Video();
                container.appendChild(object);
                //environment.scaleVideo(media.video.width, media.video.height, behaviour.media.scaleVideoTo);
                callback(object);
            }
            else if(media.type === 'graphic') {
                callback(graphic());
            }
            else {
                throw 'Invalid media type';
            }
        }

        function getLength() {
            if(object.tagName === 'VIDEO' || object.tagName === 'AUDIO') {
                return object.duration;
            }
        }

        function getCurrentTime() {
            if(object.tagName === 'VIDEO' || object.tagName === 'AUDIO') {
                return object.currentTime;
            }
        }

        function calcVideoSize(nativeWidth, nativeHeight, hostWidth, hostHeight) {

            var ratio;

            // first see if we need to scale down or up, depending on the size of video
            // and host device properties

            if(nativeWidth <= hostWidth && nativeHeight <= hostHeight) {
                // scale up

                // first find out if the video should be scaled up from the
                // width or the height
                if((hostWidth / nativeWidth) > (hostHeight / nativeHeight)) {
                    ratio = hostHeight / nativeHeight;
                }
                else {
                    ratio = hostWidth / nativeWidth;
                }
            }
            else {
                // scale down
                if((nativeWidth / hostWidth) > (nativeHeight / hostHeight)) {
                    ratio = nativeHeight / hostHeight;
                }
                else {
                    ratio = nativeWidth / hostWidth;
                }
            }

            return {
                height: ratio * nativeHeight,
                width: ratio * nativeWidth
            };
        }

        return {
            object: object,
            target: target,
            pause: pause,
            play: play,
            listen: listen,
            create: create,
            getLength: getLength,
            getCurrentTime: getCurrentTime
        };
    })();

    // Handles all user friendly notifications
    var notify = (function() {
        // lowers 'curtain' on screen and pushes notification
        var id = 'notify',
            container = helper.newElement('div', id),
            child = document.createElement('div'),
            child2 = document.createElement('p'),
            isActive = false;

        function position(object) {
            var availableWidth = environment.resolution.width,
                availableHeight = environment.resolution.height;

            css.style(object, {
                opacity: 0
            });

            var objWidth = object.offsetWidth,
                objHeight = object.offsetHeight,
                x = availableWidth / 2,
                y = (availableHeight - objHeight) / 2;

            css.style(object, {
                position: 'absolute',
                display: 'block',
                left: x,
                top: y,
                opacity: 1
            });
        }

        return {
            resize: function() {
                position(child);
            },

            push: function(message, cssClass) {
                if(isActive === false) {
                    isActive = true;
                    // animate the 'curtain falling' on theatre

                    css.animate(environment.containers.stage, 'opacity', 1, 0.2, 200);
                    environment.containers.root.appendChild(container);
                    if(cssClass) {
                        child2.setAttribute('class', cssClass);
                    }
                    container.appendChild(child);
                    child.appendChild(child2);
                }

                // push notification to screen

                child2.innerHTML = message;
                position(child);
            },

            dismiss: function() {
                if(isActive !== false) {
                    isActive = false; // reset activity flag
                    environment.containers.root.removeChild(container);
                    css.animate(environment.containers.stage, 'opacity', 0.2, 1, 200);
                }
            }
        };
    })();

    //
    // the public interface
    //

    var publicInterface = {
        // namespace for our external modules
        Modules: function() {},

        pause: function() {
            media.pause();
            return 'Paused';
        },

        play: function() {
            media.play();
            return 'Playing';
        },

        seek: function(time) {
            // scrub to time in media
            // time in seconds 4 = 4 seconds
            media.seek(time);
            return 'Seeking';
        },

        reload: function() {
            // restarts the current scene

            return 'Reloaded scene';
        },

        skip: function(sceneName) {
            // abandon current scene and load the named scene

            return 'Skipped to scene' + sceneName;
        },

        viewportResize: function() {

        },

        fullScreen: fullScreen.toggle,

        status: function() {
            // report stats on media
            console.log(status);
            console.log('Current time:' + media.getCurrentTime() + ' / Duration: ' + media.getLength());
        },

        currentTime: {
            seconds: function() {
                return media.getCurrentTime();
            },

            object: function() {
                return helper.clock(media.getCurrentTime());
            }
        },

        duration: {
            seconds: function () {
                return media.getLength();
            },

            object: function () {
                return helper.clock(media.getLength());
            }
        }
    };

    // our public initialise method, used to initialise our application
    publicInterface.initialise = function(target, scriptFile, firstScene, resolution, callback) {
        // --
        // Program begins here. Runs once and sets sets up the environment.
        // --

        // load script file and check the returned data

        helper.ajaxRequest('js/behaviour.json', 'JSON', true, function(returnedData) {
            behaviour = returnedData;

            helper.ajaxRequest(scriptFile, 'JSON', true, function(returnedData) {
                script = returnedData;

                // set up the environment
                environment.initialise(target, resolution);
                modules = new loomSE.Modules();
                readScript.setScene(script, firstScene);
                gui.load();

                if(callback) {
                    callback();
                }
            });
        });
    };
    // return just the public parts
    return publicInterface;
}());