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
            lockEventToMediaTime: false // untested
        },
        script,
        firstScene = 'intro',
        minimumResolution = {
        // default values, overridden by values in script - if set
            width: 640,
            height: 480
        },
        sizeMultiplier = 1,
        prefix = 'loom_',
        stage = (function() {
            var id = 'loom_stage',
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
        overlay = (function() {
            var id = 'loom_overlay';

            return {
                id: id
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

        random: function(maxRange,minRange) {
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
        }
    };

    var node = {
        maximise: function(element) {
            utilities.style(element, {
                'width': window.innerWidth,
                'height': window.innerHeight
            });
        },

        create: function(id) {
            var element = document.create('div');
            element.setAttribute('id', id);
            return element;
        },

        remove: function(element) {
            //element.parentNode.removeChild(element);
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
            this.media = assets.media;
            this.data = assets.data;
            this.parameters = assets.parameters;
            this.events = assets.events;
            this.container = (function() {
                var element = document.createElement('div');
                element.setAttribute('id', that.sceneId);
                element.media = that.media;
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
                //status.media = currentScene.media;
                history.record(currentScene);
                process(currentScene);
            }

            function process(scene) {
                // --
                // Processes the current scene
                // --
                // Each scene is composed of a 'media' type, which in turn has 'data' and 'parameters'
                // Each 'media' type also has a number of events
                media.create(scene.container, scene.media, scene.data, scene.parameters, function() {
                    if(scene.events !== null){
                        events(scene.events);
                    }
                    else {
                        console.log('No events to report');
                    }
                });

                function events(array) {
                    // --
                    // Schedules timed events for each media element
                    // --

                    for(var i in array){
                        var event = array[i],
                            id = prefix + event.type + '_' + i;

                        var createEvent = new Event(id, event.call, event.type, event.schedule, event.data, event.parameters);

                        Event.prototype.schedule = function () {
                            var that = this;
                            if(devOptions.lockEventToMediaTime === false){
                                setTimeout(function(){
                                    that.run();
                                }, that.in);

                                setTimeout(function () {
                                    node.remove(document.getElementById(id));
                                }, that.out);
                            }
                            else if(devOptions.lockEventToMediaTime === true && scene.media === 'video'){
                                var selection = media.target(scene.sceneId);
                                selection.addEventListener('timeupdate', function() {
                                    if(this.currentTime >= that.in){
                                        that.run();
                                    }
                                });
                                selection.addEventListener('timeupdate', function () {
                                    if (this.currentTime >= that.out) {
                                        node.remove(document.getElementById(id));
                                    }
                                });
                            }
                        };

                        createEvent.schedule();
                    }
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
            var selection = target(sceneId);
            if(typeof selection === 'object'){
                selection.pause();
            }
        }

        function create(container, media, data, parameters, callback) {
            // --
            // Processes the media
            // --
            stage.object.appendChild(container);

            switch(media) {
                case 'audio':
                    audio();
                    break;
                case 'video':
                    video();
                    break;
                case 'graphic':
                    graphic();
                    break;
                default:
                    throw 'Invalid media';
            }

            function ready(){
                if(media === 'video' || 'audio'){
                    if(parameters.autoplay === true){

                    }
                    callback();
                }
            }

            function audio(){
            }

            function video(){
                // --
                // Handles HTML5 video on screen
                // --

                var videoAttributes = [],
                    videoElement;

                function createVideoElement(file, attributes){
                    function setVideoAttributes(value, index, array){
                        element.setAttribute(value, null);
                    }

                    var element = document.createElement('video'),
                        child = document.createElement('source'),
                        width = stage.object.offsetWidth,
                        height = stage.object.offsetHeight;

                    element.setAttribute('width', width);
                    element.setAttribute('height', height);
                    attributes.forEach(setVideoAttributes);
                    child.setAttribute('src', file);
                    child.setAttribute('type', 'video/mp4');
                    element.appendChild(child);
                    return element;
                }

                if(parameters.loop === true){
                    videoAttributes.push('loop');
                }
                //if(parameters.autoplay === true){
                //    videoAttributes.push('autoplay');
                //}

                videoElement = createVideoElement(data.file, videoAttributes);

                if(parameters.loop === false && (data.nextSceneByDefault !== null || data.nextnextSceneByDefault !== '')){
                    videoElement.onended = function(e){
                        scriptLogic.mediaQueue.set(data.nextSceneByDefault);
                    };
                }

                container.appendChild(videoElement);
                //pause('intro');
            }

            function graphic(){
            }
        }

        return {
            target: target,
            pause: pause,
            create: create
        };
    })();

    var Event = function(id, call, type, schedule, data, parameters) {
        var that = this;

        this.id = id;
        this.call = call;
        this.type = type;
        this.in = schedule.in;
        this.out = (function () {
            var out;

            if(typeof schedule.out === 'number'){
                out = schedule.out;
            }

            else if(typeof schedule.length === 'number'){
                out = (schedule.in + schedule.length);
            }

            return out;
        })();
        this.data = data;
        this.parameters = parameters;
        this.run = function () {
            var plugin = new publicMethods.Plugin(that),
                call = plugin[that.call];

            if(typeof call === 'function'){
                call(that);
            }
        };
    };

    //
    // Public
    //
    var publicMethods = {
        version: '0.2b',
        status: {
            media: null // current type of media in queue
        }
    };

    // Properties
    publicMethods.publicProperty = null;

    publicMethods.Plugin = function(data) {

    };

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
        return {
            pause: function(){
                // pause all events, media, timeout
                if(status.media === 'video'){
                    document.getElementById(prefix + 'video').pause();
                }
            },

            play: function(){
                // resume all events, media, timeout
                if(status.media === 'video'){
                    document.getElementById(prefix + 'video').play();
                }
            },

            reload: function() {
                // restarts the current scene
            },

            skip: function(sceneName) {
                // abandon current scene and load the named scene
            },

            scaleMedia: function(dimensions, location) {
                // resizes currently playing media and repositions it
            },

            viewportResize: function(){
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

            fullscreen: function(){
                // set app to fullscreen
            }
        };
    })();

    //Return just the public parts
    return publicMethods;
}());