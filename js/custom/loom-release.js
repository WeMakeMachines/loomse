//
// Loom.js
//
// Author: Franco Speziali
//
// API for handling onscreen graphics, html5 video, and simple on screen interactions
//
// Future ideas:
// -Filters
//
// Notes:
// see jsfiddle : http://jsfiddle.net/gakb4n6g/ and http://jsfiddle.net/gakb4n6g/1/ for example on jQuery promises
//

var Loom = (function() {

    //
    // Private
    //

    // Private variables
    var devOptions = {
            // developer options only
            lockEventToMediaTime: true, // default should be true, if false, uses setTimeOut
            muteAudio: false, // overrides any settings in script
            debug: false, // verbose mode for errors
            disableCheckScript: false // by default script file is checked for errors, set to true to skip this
        },
        script,
        firstScene = 'intro',
        mediaTimeEventResolution = 0.4,// this is margin for which events are detected on the timecode of the media playing, if flag lockEventToMediaTime is set to true
        minimumResolution = {
        // default values, overridden by values in script - if set
            width: 640,
            height: 480
        },
        sizeMultiplier = 1, // forgot why I put this here
        prefix = 'loom_', // to be made redundant, see id function below
        status = {
            version: '0.2b',
            control: null, // playing or paused?
            media: null, // current type of media in queue
            id: null // id of media in queue
        },
        root = {},
        stage = {},
        mediaGroup = (function() {
            var id = 'loom_mediaGroup', // to be made redundant, see id function below
                elements = [];

            return {
                id: id,
                add: function(id, media) {
                    elements.push([id, media]);
                },
                remove: function(id) {
                    for(var i=1; i <= elements.length; i++){
                        if(elements.array[i - 1][0] === id){
                            elements.splice(i-1, 1);
                        }
                    }
                }
            };
        })(),
        overlay = (function() { // function to be made redundant, see id function below - plan is to centralise ids
            var id = 'loom_overlay';

            return {
                id: id
            };
        })(),
        id = (function() {
            var separator = '_',
                root = 'loom',
                stage = 'stage',
                notify = 'notify',
                mediaGroup = 'mediaGroup',
                overlay = 'overlay',
                video = 'video',
                audio = 'audio';

            return {
                root: root,
                stage: root + separator + stage,
                notify: root + separator + notify,
                overlay: root + separator + overlay,
                mediaGroup: root + separator + mediaGroup,
                video: root + separator + video,
                audio: root + separator + audio
            };
        })();

    // Common utilities which may be referred to from other functions
    var utilities = {
        ajaxRequest: function(file, async, callback) {
            var data,
                xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {

                console.log(xmlhttp.readyState);

                if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    data = JSON.parse(xmlhttp.responseText);
                    callback(data);
                }
            };

            xmlhttp.open('GET', file, async);
            xmlhttp.send();
        },

        report: function(object) {
            // display report
            console.log(object);
        },

        displayError: function(errorMessage) {
            var errorText = '\n*** Error ***\n';
            // throw an exception
            throw errorText + errorMessage;
            //console.log(errorText + errorMessage);
        },

        random: function(minRange, maxRange) {
            if(typeof minRange === 'undefined') {
                var minRange = 0;
            }
            var range = maxRange - minRange;
            if(range <= 0){
                range = maxRange;
                minRange = 0;
            }
            // returns a random number between 1 and number
            var number = (Math.floor((Math.random() * range)) + minRange);
            return number;
        },

        cleanString: function(string) {
            // removes whitespace, and converts to lowercase
            var cleanedString = string.replace(/[^a-z0-9_]+]/gi, '');
            return cleanedString.toLowerCase();
        },

        style: function(element, object) {
            for(var attribute in object)
            {
                var value = object[attribute];

                switch(attribute)
                {
                    case 'width':
                    case 'height':
                    case 'top':
                    case 'left':
                    case 'right':
                    case 'bottom':
                        value = value + 'px';
                }
                element.style[attribute] = value;
            }
        },

        animateCSS: function(element, parameter, startValue, endValue, time, callback) {
            var currentValue,
                steps = 4, // adjust this value to make animation smoother
                currentStep = 0,
                difference = endValue - startValue,
                timeStep = time / steps,
                valueStep = difference / steps,
                object = {},
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
                        object[parameter] = currentValue;
                        utilities.style(element, object);
                        currentStep = currentStep + 1;
                    }
                }, timeStep);
        }
    };

    // Handles addition and removal of HTML nodes, as well as other exchanges
    var node = {
        maximise: function(element) {
            utilities.style(element, {
                'width': window.innerWidth,
                'height': window.innerHeight
            });
        },

        // not sure if I'm keeping add / remove or offloading onto module
        add: function(id) {
            var element = document.createElement('div');
            element.setAttribute('id', id);
            return element;
        },

        remove: function(element) {
            element.parentNode.removeChild(element);
        }
    };

    // Keeps a record of the scenes passed through by the user. Provides some control over how to navigate the history
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
                var scene = scenes[scenes.length-1];
                return scene;
            },
            rewind: function() {
                // goes back 1 scene & erases current scene
                var scene;
                if(scenes.length > 1){
                    scenes.splice(scenes.length-1, 1);
                }
                scene = scenes[scenes.length-1];
                return scene;
            }
        };
    })();

    // Handles the script logic
    var scriptLogic = (function() {
        function Scene(title, assets) {
            var that = this;
            this.title = title;
            this.shortName = assets.short_name;
            this.longName = assets.long_name;
            this.sceneId = utilities.cleanString(this.title);
            //this.data = assets.data;
            this.media = assets.media;
            // why is this not here?
            //if(this.media === 'video') {
            //    this.video = assets.video;
            //}
            //if(this.media === 'audio') {
            //    this.audio = assets.audio;
            //}
            this.events = assets.events;
            this.container = (function() {
                var element = document.createElement('div');
                element.setAttribute('id', that.sceneId);
                element.media = that.media.type;
                return element;
            })();
        }

        var mediaQueue = (function() {
            // --
            // A collection of methods that set process the media elements in the Script
            // --
            function set(scene) {
                // --
                // Runs when a new scene is set from the Script
                // Pulls the relevant scene details from the object, resets parameters and launches the process() method.
                // --
                //var source = script.scenes,
                //    currentScene;
                //environment.clear();

                // var currentScene = new Scene(scene, source[scene]);
                var currentScene = new Scene(scene, script.scenes[scene]);
                status.media = currentScene.media.type;
                history.record(currentScene);
                process(currentScene);
            }

            function process(currentScene) {
                // --
                // Processes the current scene
                // --
                // Each scene is composed of a 'media' type, which in turn has 'data' and 'parameters'
                // Each 'media' type also has a number of events

                media.create(currentScene.container, currentScene.media, function(playObject) {

                    if(currentScene.media.type === 'video') { // TODO need to allow this to accept and process multiple strings
                        currentScene.media.video.duration = playObject.duration;

                        if(playObject.parameters.autoplay === true) {
                            publicMethods.control.play(); // TODO should setup a system to give 'all clear' before allowing video to start
                            console.log(playObject.readyState);
                        }

                        //if(playObject.loop === false && (scene.data.nextSceneByDefault !== null || scene.data.nextnextSceneByDefault !== '')){
                        //    playObject.onended = function(e){
                        //        scriptLogic.mediaQueue.set(scene.data.nextSceneByDefault);
                        //    };
                        //}

                        if(playObject.parameters.loop === true) {
                            if(playObject.parameters.loopIn === 0 && typeof playObject.parameters.loopOut !== 'number') {
                                playObject.onended = function(e){
                                    publicMethods.control.scrub(0);
                                    publicMethods.control.play();
                                };
                            }
                            else {
                                // add loop point as event
                                // for the purposes of our system, in / out points are reversed
                                // (schedule in point is actually loop out point etc)
                                currentScene.events.push(
                                    {
                                        call: 'loop',
                                        schedule: {
                                            in: playObject.parameters.loopOut,
                                            out: playObject.parameters.loopIn
                                        }
                                    }
                                );
                            }
                        }
                    }

                    if(currentScene.events !== null) {
                        events(playObject, currentScene.events, function() {});
                    }
                    else {
                        console.log('No events to report');
                    }
                });

                function events(target, array, callback) {
                    // --
                    // Schedules timed events for each media element
                    // --

                    for(var i in array){
                        var event = array[i],
                            id = prefix + event.call + '_' + i;

                        var createEvent = new Event(id, event.call, event.schedule, event.parameters);

                        Event.prototype.schedule = function () {
                            var that = this,
                                // We calculate the ins and outs here depending on the flag lockEventToMediaTime
                                // * HTML5 media *
                                // * setTimeOut *
                                timeIn = that.in,
                                timeOut = that.out,
                                timeInLow = timeIn - (mediaTimeEventResolution / 2),
                                timeInHigh = timeIn + (mediaTimeEventResolution / 2),
                                timeOutLow = timeOut - (mediaTimeEventResolution / 2),
                                timeOutHigh = timeOut + (mediaTimeEventResolution / 2);

                            //console.log('>' + timeIn);
                            //console.log('>' + timeInLow + ' ' + timeInHigh);
                            //console.log('>' + timeOut);
                            //console.log('>' + timeOutLow + ' ' + timeOutHigh);

                            if(devOptions.lockEventToMediaTime === false) {
                                setTimeout(function() {
                                    that.run();
                                }, that.in);

                                if(typeof that.out === 'number') {
                                    setTimeout(function () {
                                        that.stop();
                                        //node.remove(document.getElementById(that.id));
                                    }, that.out);
                                }
                            }

                            // this is a weak point in the software, very reliant on the numbers being right
                            else if(devOptions.lockEventToMediaTime === true && (currentScene.media.type === 'video' || currentScene.media.type === 'audio')) {
                                target.addEventListener('timeupdate', function () {
                                    // 'In'
                                    if(this.currentTime >= timeInLow && this.currentTime <= timeInHigh){
                                        that.run();
                                    }
                                    // 'Out'
                                    if(this.currentTime >= timeOutLow && this.currentTime <= timeOutHigh) {
                                        that.stop();
                                        //node.remove(document.getElementById(that.id));
                                    }
                                });
                            }
                        };

                        createEvent.schedule();
                    }

                    callback();
                }
            }

            return {
                set: set,
                process: process
            };
        })();

        return {
            mediaQueue: mediaQueue
        }
    })();

    // Handles differing media
    var media = (function() {
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

        function pause(sceneId) {
            // Pause the SCENE

            // perhaps in the wrong place?

            //status.control = 'paused';

            var selection = target(sceneId);
            if(typeof selection === 'object') {
                selection.pause();
            }
        }

        function play(element) {
            // Play the SCENE

            // perhaps in the wrong place?

            //status.control = 'playing';

            //function ready(){
            //    if(media === 'video' || 'audio'){
            //        if(parameters.autoplay === true){
            //
            //        }
            //        callback();
            //    }
            //}
        }

        function create(container, media, callback) {
            // --
            // Creates a media object and posts to DOM
            // --
            var mediaElement;

            function audio() {
                // TODO

                return;
            }

            var Video = function() {
                // --
                // Create video element for screen
                // --

                var element = document.createElement('video'),
                    child1 = document.createElement('source'),
                    child2 = document.createElement('source'),
                    width = mediaGroup.object.offsetWidth,
                    height = mediaGroup.object.offsetHeight;

                element.setAttribute('width', width);
                element.setAttribute('height', height);
                element.setAttribute('id', id.video);

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

                status.id = id.video;

                element.parameters = {};

                if(media.video.muted === true) {
                    element.muted = true;
                }

                // overrides any previous settings
                if(devOptions.muteAudio === true) {
                    element.muted = true;
                }

                if(media.video.controls === true) {
                    element.controls = true;
                    //element.setAttribute('controls', true);
                }

                if(media.video.autoplay === true) {
                    element.parameters.autoplay = true;
                }

                if(media.video.loop === true) {
                    element.parameters.loop = true;
                    if(typeof media.video.loop_in === 'number') {
                        element.parameters.loopIn = media.video.loop_in;
                    } else {
                        element.parameters.loopIn = 0;
                    }

                    if(typeof media.video.loop_out === 'number') {
                        element.parameters.loopOut = media.video.loop_out;
                    } else {
                        element.parameters.loopOut = null;
                    }
                }

                return element;
            };

            function graphic() {

                return;
            }

            mediaGroup.object.appendChild(container);

            if(!callback){
                throw 'Expected callback';
            }

            if(media.type === 'audio') {
                callback(audio());
            }
            else if(media.type === 'video') {
                mediaElement = new Video();
                container.appendChild(mediaElement);
                callback(mediaElement);
            }
            else if(media.type === 'graphic') {
                callback(graphic());
            }
            else {
                throw 'Invalid media type';
            }
        }

        return {
            target: target,
            pause: pause,
            play: play,
            create: create
        };
    })();

    var notify = (function() {
        // possible options:
        // message
        // function to dismiss the notification
        var isActive = false,
            container = document.createElement('div'),
            child = document.createElement('div'),
            child2 = document.createElement('p');

        function position(object) {
            var availableWidth = window.innerWidth,
                availableHeight = window.innerHeight;

            utilities.style(object, {
                opacity: 0
            });

            var objWidth = object.offsetWidth,
                objHeight = object.offsetHeight,
                x = (availableWidth - objWidth) / 2 ,
                y = (availableHeight - objHeight) / 2;

            console.log(objWidth + ' ' + objHeight);

            utilities.style(object, {
                position: 'absolute',
                display: 'block',
                left: x,
                top: y,
                opacity: 1
            });
        }

        return {
            push: function(message) {
                if(status.control === 'playing') {
                    publicMethods.control.pause();
                }

                if(isActive === false) {
                    isActive = true; // set active flag
                    // create conditions for notification

                    container.setAttribute('id', id.notify);

                    // make child full size of screen
                    node.maximise(container);

                    // animate the 'curtain falling' on stage

                    utilities.animateCSS(stage.object, 'opacity', 1, 0.2, 200);

                    root.object.appendChild(container);
                    container.appendChild(child);
                    child.appendChild(child2);
                }

                // push notification to screen

                child2.innerHTML = message;
                position(child);
            },

            dismiss: function() {
                if(isActive === false) {
                    return;
                }
                else {
                    // function goes here
                    isActive = false; // reset activity flag
                    root.object.removeChild(container);
                    utilities.animateCSS(stage.object, 'opacity', 0.2, 1, 200);
                    if(status.control === 'paused') {
                        publicMethods.control.play();
                    }
                }
            }
        };
    })();

    // Constructor function that creates instances of each event
    var Event = function(id, call, schedule, parameters) {
        var that = this,
            plugin = new Loom.Modules();

        //check if the module reference exists as a function
        if(typeof plugin[call] === 'function') {
            var callModule = plugin[call]();
        }

        this.id = id; // event id
        this.call = call;
        this.status = status;
        this.in = function() {
            var time;
            if (devOptions.lockEventToMediaTime === true) {
                time = (schedule.in / 1000);
            }
            else {
                time = schedule.in;
            }
            return time;
        }();
        this.out = function() {
            var time;
            if (devOptions.lockEventToMediaTime === true) {
                time = (schedule.out / 1000);
            }
            else {
                time = schedule.out;
            }
            return time;
        }();
        this.parameters = parameters;
        this.run = function() {
            callModule.run(document.getElementById(overlay.id), that);
        };
        this.stop = function() {
            callModule.stop();
        };
    };

    //
    // Public
    //

    //var Plugins = function() {
    //
    //};
    //
    //Loom.Plugins = function() {
    //
    //};

    var publicMethods = {};

    // namespace for our external modules
    publicMethods.Modules = function() {
    };

    publicMethods.notify = function(message) {
        // temporary function to test the notification function
        notify.push(message);
    };

    publicMethods.notifyDismiss = function(message) {
        // temporary function to test the notification function
        notify.dismiss();
    };

    publicMethods.runCounter = function() {
    // temporary function designed to call a module from console

        var j = new Loom.Modules(),
            o = j.mediaTime(),
            data = {
                status: {
                    media: 'video',
                    id: status.id
                },
                id: 'mediaTime',
                parameters: {
                    x: 70,
                    y: 70,
                    class: 'mediaTime'
                }
            };

        o.run(document.getElementById(overlay.id), data);
    };

    // Properties
    publicMethods.publicProperty = null;


    // Methods
    publicMethods.initialise = function(scriptFile) {
        // --
        // Program begins here. Runs once and sets sets up the environment.
        // --

        //var body = document.getElementsByTagName('body');
        //body[0].setAttribute('onresize', 'Loom.control.viewportResize()');

        //window.onresize = Loom.control.viewportResize();

        //window.addEventListener('resize', Loom.rez(), true);k

        //if(environment.check() == false){
        //    console.log('WARNING: Screen too small');
        //}

        // load script file and check the returned data

        function checkScriptReturn(returnedScript) {
            // check the script file is valid
            // we check for variable type validity
            // as well as availability of media files

            var report = [];

            var scriptOptions = [['settings.minimum_resolution.width', 'number'], ['settings.minimum_resolution.height', 'number']];

            var test = [[2133213, 'number'], ['dsadsd', 'number'], [2133213, 'number'], [2133213, 'number']];

            function checkDataType(element, index) {
                var option = element[0],
                    expectedType = element[1],
                    line;
                if (typeof option !== expectedType) {
                    line = 'Type mismatch on script option ' + option + ', expected ' + expectedType;
                    report.push(line);
                }
            }

            function checkURL(url, duration) {
                var line;

                if(typeof url === 'string') {
                    var xmlhttp = new XMLHttpRequest();

                    xmlhttp.onreadystatechange = function() {
                        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                            line = url + ' ready!';
                            report.push(line);
                        } else if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {
                            line = url + ' returns 404';
                            report.push(line);
                        }

                        console.log(report);
                    };

                    xmlhttp.open('GET', url, true);
                    xmlhttp.send();
                }
                else {
                    line = 'Project base URL missing';
                    report.push(line);
                }
            }

            function checkDataTypes(options, source) {
                options.forEach(function(element, index) {
                    var option = element[0],
                        selectedOption = source[option],
                        expectedType = element[1],
                        line;
                    if (typeof option !== expectedType) {
                        line = 'Type mismatch on script option ' + option + ', expected ' + expectedType;
                        report.push(line);
                    }
                })
            }

            function checkValidity() {

            }

            function checkMediaFiles() {

            }

            //test.forEach(checkDataType);

            //checkDataTypes(scriptOptions, returnedScript);
            //
            checkURL(returnedScript.settings.url);
            checkURL(returnedScript.scenes.intro.media.video.ogg);
            checkURL(returnedScript.scenes.intro.media.video.mp4);

            console.log(report);

            script = returnedScript; // TODO this needs to be individually parsed for data integrity, prerequisite - we need the script file schematics to be finalised

            minimumResolution.width = script.settings.minimum_resolution.width; // TODO check value is number
            minimumResolution.height = script.settings.minimum_resolution.height;

            // turn IDs into objects

            root.object = document.getElementById(id.root);
            stage.object = document.getElementById(id.stage);
            mediaGroup.object = document.getElementById(mediaGroup.id);
            overlay.object = document.getElementById(overlay.id);

            // set our environment
            node.maximise(mediaGroup.object);
            node.maximise(overlay.object);
            scriptLogic.mediaQueue.set(firstScene);
        }

        utilities.ajaxRequest(scriptFile, true, function(returnedData) {
            if (devOptions.disableCheckScript === false) {
                checkScriptReturn(returnedData)
            }
        });
    };

    publicMethods.status = function() {
        // report stats on media
        // (unfinished)
        var selection = document.getElementById(status.id);

        console.log('Length of media file: ' + selection.duration);
        console.log(status);
    };

    publicMethods.control = (function () {
        // This is wrong
        // This is external control to control the playing / pausing of the SCENE - NOT just the video itself

        return {
            pause: function() {
                var selection = document.getElementById(status.id);
                // pause all events, media, timeout

                // media
                if(status.media === 'video' || status.media === 'audio'){
                    //document.getElementById(prefix + 'video').pause();
                    status.control = 'paused';
                    selection.pause();
                }

                return 'Paused';
            },

            play: function() {
                var selection = document.getElementById(status.id);
                // resume all events, media, timeout

                // media
                if(status.media === 'video' || status.media === 'audio'){
                    status.control = 'playing';
                    selection.play();
                }

                return 'Playing';
            },

            scrub: function(time) {
                // scrub to time in media
                var selection = document.getElementById(status.id);

                if(typeof time !== 'number') {
                    return 'ERR: Can not seek';
                }
                else {
                    selection.currentTime = time;
                }
            },

            reload: function() {
                // restarts the current scene

                return 'Reloaded scene';
            },

            skip: function(sceneName) {
                // abandon current scene and load the named scene

                return 'Skipped to scene' + sceneName;
            },

            scaleMedia: function(dimensions, location) {
                // resizes currently playing media and repositions it
            },

            viewportResize: function() {
                // resizes the screen
                node.maximise(mediaGroup.object);
                node.maximise(overlay.object);
                //elements.array.forEach(function(element, index, array){
                //    // find all records that have position information
                //    if(element[1] !== null){
                //        //view.element(document.getElementById(element[0]),{
                //        //    position: element[1]
                //        //}).position();
                //    }
                //    // fullscreen elements
                //    if(element[1] === 'full'){
                //        maxDimensions(document.getElementById(element[0]));
                //    }
                //});
            },

            fullscreen: function() {
                // set app to fullscreen
            }
        };
    })();

    //Return just the public parts
    return publicMethods;
}());