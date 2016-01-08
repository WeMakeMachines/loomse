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

    // Properties
    var devOptions = {
            // developer options only
            lockEventToMediaTime: true, // default should be true, if false, uses setTimeOut
            muteAudio: false // overrides any settings in script
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
        stage = (function() {
            var id = 'loom_stage', // to be made redundant, see id function below
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
            var prefix = 'loom_',
                stage = 'stage',
                overlay = 'overlay',
                video = 'video',
                audio = 'audio';

            return {
                overlay: prefix + overlay,
                stage: prefix + stage,
                video: prefix + video,
                audio: prefix + audio
            };
        })();

    // Methods
    var utilities = {
        ajaxRequest: function(file, dataType, async, callback) {
            var data;
            $.ajax({
                url: file,
                async: async,
                data: null,
                type: 'GET',
                timeout: 2000,
                dataType: dataType,
                error: function(jqXHR,textStatus,errorThrown){
                    var errorMessage = 'Function: ajaxRequest\nFile: ' + file + '\nType: ' + textStatus + '\nMessage: ' + errorThrown;
                    utilities.displayError(errorMessage);
                },
                success: function(response){
                    data = response;
                }
            });
            return data;
        },

        displayError: function(errorMessage) {
            var errorText = '\n*** Error ***\n';
            // throw an exception
            throw errorText + errorMessage;
            //console.log(errorText + errorMessage);
        },

        random: function(minRange, maxRange) {
            if(typeof minRange === 'undefined' ){
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

        checkScript: function(script) {
            // check for malformed data, validity

        }
    };

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

    var scriptLogic = (function() {
        function Scene(sceneTitle, assets) {
            var that = this;
            this.sceneTitle = sceneTitle;
            this.sceneId = utilities.cleanString(this.sceneTitle);
            //this.media = assets.media;
            //this.data = assets.data;
            this.media = assets.media;
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
                var source = script.scenes,
                    currentScene;
                //environment.clear();

                currentScene = new Scene(scene, source[scene]);
                status.media = currentScene.media.type;
                history.record(currentScene);
                process(currentScene);
            }

            function process(scene) {
                // --
                // Processes the current scene
                // --
                // Each scene is composed of a 'media' type, which in turn has 'data' and 'parameters'
                // Each 'media' type also has a number of events

                media.create(scene.container, scene.media, function(playObject) {

                    if(scene.media.type === 'video') {
                        if(playObject.parameters.autoplay === true) {
                            publicMethods.control.play();
                        }

                        //if(playObject.loop === false && (scene.data.nextSceneByDefault !== null || scene.data.nextnextSceneByDefault !== '')){
                        //    playObject.onended = function(e){
                        //        scriptLogic.mediaQueue.set(scene.data.nextSceneByDefault);
                        //    };
                        //}

                        if(playObject.parameters.loop === true) {
                            if(playObject.parameters.loopIn === null) {
                                playObject.onended = function(e){
                                    publicMethods.control.scrub(0);
                                    publicMethods.control.play();
                                };
                            }
                            else {
                                // add loop point as event
                                // for the purposes of our system, in / out points are reversed
                                // (schedule in point is actually loop out point etc)
                                scene.events.push(
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

                    if(scene.events !== null) {
                        events(playObject, scene.events, function() {});
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
                            else if(devOptions.lockEventToMediaTime === true && (scene.media.type === 'video' || scene.media.type === 'audio')) {
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

            //switch(media) {
            //    case 'audio':
            //        audio();
            //        break;
            //    case 'video':
            //        video();
            //        break;
            //    case 'graphic':
            //        graphic();
            //        break;
            //    default:
            //        throw 'Invalid media';
            //}

            function audio() {
                // TODO

                return;
            }

            var Video = function() {
                // --
                // Create video element for screen
                // --

                var element = document.createElement('video'),
                    child = document.createElement('source'),
                    width = stage.object.offsetWidth,
                    height = stage.object.offsetHeight;

                element.setAttribute('width', width);
                element.setAttribute('height', height)
                element.setAttribute('id', id.video);
                child.setAttribute('src', media.videoOGG);
                child.setAttribute('type', 'video/ogg');
                //child.setAttribute('src', media.videoMP4);
                //child.setAttribute('type', 'video/mp4');

                element.appendChild(child);

                status.id = id.video;

                element.parameters = {};

                if(media.muted === true) {
                    element.muted = true;
                }

                // overrides any previous settings
                if(devOptions.muteAudio === true) {
                    element.muted = true;
                }

                if(media.controls === true) {
                    element.controls = true;
                    //element.setAttribute('controls', true);
                }
                if(media.autoplay === true) {
                    element.parameters.autoplay = true;
                }
                if(media.loop === true) {
                    element.parameters.loop = true;
                    element.parameters.loopIn = media.loop_in;
                    element.parameters.loopOut = media.loop_out;
                }

                return element;
            };

            function graphic() {

                return;
            }

            stage.object.appendChild(container);

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

    var publicMethods = {
        status: status
    };

    // namespace for our external modules
    publicMethods.Modules = function() {
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

        //window.addEventListener('resize', Loom.rez(), true);

        // grab data
        // load minimum resolution requirements from script, and check
        script = utilities.ajaxRequest(scriptFile, 'json', false); // TODO add promise and switch to async with callback
        minimumResolution.width = script.minimum_resolution.width; // TODO check value is number
        minimumResolution.height = script.minimum_resolution.height;
        //if(environment.check() == false){
        //    console.log('WARNING: Screen too small');
        //}

        // turn IDs into objects
        stage.object = document.getElementById(stage.id);
        overlay.object = document.getElementById(overlay.id);
        // set our environment
        node.maximise(stage.object);
        node.maximise(overlay.object);
        scriptLogic.mediaQueue.set(firstScene);
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

            status: function() {
                // report stats on media
                // (unfinished)
                var selection = document.getElementById(status.id);

                return 'Length of media file: ' + selection.duration;
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
                node.maximise(stage.object);
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