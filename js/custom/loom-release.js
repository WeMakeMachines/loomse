//
// Loom Story Engine v0.22
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

// I feel, I fought, I foundered

var LoomSE = (function() {

    //
    // Private
    //

    // Private variables
    var devOptions = {
        // developer options only
        muteAudio: true, // overrides any settings in script
        verbose: 'full', // reports errors, findings, events etc to console. Options are full | minimal
        disableCheckScript: false, // by default script file is checked for errors, set to true to skip this
        mediaLoadType: 'progressive' // full | progressive
    },
    script,
    firstScene = 'intro',
    currentScene,
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
        control: 'waiting', // playing | paused | seeking | waiting | error
        media: null, // current type of media in queue
        id: null // id of media in queue
    },
    mediaObject = {},
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
        ajaxRequest: function(file, fileType, async, callback) {
            var data,
                xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    if(fileType === 'JSON'){
                        data = JSON.parse(xmlhttp.responseText);
                    }
                    else {
                        data = xmlhttp.responseText;
                    }
                    callback(data);
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
    var readScript = (function() {
        // --
        // A collection of methods that set process the media elements in the Script
        // --
        function setScene(scriptObject, scene) {
            // --
            // Runs when a new scene is set from the Script
            // Pulls the relevant scene details from the object, resets parameters and launches the process() method.
            // --
            //var source = script.scenes,
            //    currentScene;
            //environment.clear();

            //function processEvents(array, callback) {
            //    var id,
            //        currentRecord,
            //        event = {};
            //
            //    //console.log(array);
            //
            //    if(array !== null){
            //        for(var i=1; i <= (array.length); i++) {
            //            currentRecord = array[i-1];
            //
            //            //console.log(currentRecord);
            //
            //            //id = prefix + event.call + '_' + i;
            //            events.addToQueue(currentRecord.schedule.in, currentRecord.schedule.out, new Event2(id, currentRecord.call, currentRecord.parameters), currentRecord.ignored);
            //            if(i === array.length) {
            //                callback();
            //            }
            //        }
            //    }
            //}

            currentScene = new Scene(scene, scriptObject.settings.language, scriptObject.scenes[scene]);
            if(scriptObject.settings.subtitlesOn === true) {
                subtitles.parseSubtitles(currentScene.subtitles);
            }
            //processEvents(currentScene.events, function() {
            //    events.sortQueue();
            //});
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

            function scheduleEvents(target, array, callback) {
                // --
                // Schedules timed events for each media element
                // --

                for(var i in array){
                    var event = array[i],
                        id = prefix + event.call + '_' + i;

                    var createEvent = new Event(id, event.call, event.schedule, event.parameters);

                    Event.prototype.schedule = function () {

                        // We calculate the ins and outs here
                        var that = this,
                            timeIn = that.in,
                            timeOut = that.out,
                            timeInLow = timeIn - (mediaTimeEventResolution / 2),
                            timeInHigh = timeIn + (mediaTimeEventResolution / 2),
                            timeOutLow = timeOut - (mediaTimeEventResolution / 2),
                            timeOutHigh = timeOut + (mediaTimeEventResolution / 2);

                        media.listen(function(time) {
                            if(time >= timeInLow && time <= timeInHigh){
                                if(devOptions.verbose === 'full') {
                                    utilities.report('[Event] Run: ' + id);
                                    utilities.report('[Event] ' + 'T:' + time + ', L:' + timeInLow + ', H:' + timeInHigh);
                                }

                                that.run();
                            }
                            // 'Out'
                            if(time >= timeOutLow && time <= timeOutHigh) {
                                if(devOptions.verbose === 'full') {
                                    utilities.report('[Event] Stop: ' + id);
                                    utilities.report('[Event] ' + 'T:' + time + ', L:' + timeOutLow + ', H:' + timeOutHigh);
                                }

                                that.stop();
                                //node.remove(document.getElementById(that.id));
                            }
                        });
                    };

                    createEvent.schedule();
                }

                callback();
            }

            media.create(scene.container, scene.media, function(playObject) {

                mediaObject = playObject;
                // check which media needs to play
                // play video
                if(scene.media.type === 'video') { // TODO need to allow this to accept and process multiple strings
                    //scene.media.video.duration = playObject.duration;

                    // check if video SHOULD autoplay
                    if(mediaObject.parameters.autoplay === true) {
                        media.play(mediaObject);
                    }

                    //if(playObject.loop === false && (scene.data.nextSceneByDefault !== null || scene.data.nextnextSceneByDefault !== '')){
                    //    playObject.onended = function(e){
                    //        readScript.setScene(scene.data.nextSceneByDefault);
                    //    };
                    //}

                    // video loop logic must stay here
                    if(playObject.parameters.loop === true) {
                        if(playObject.parameters.loopIn === 0 && typeof playObject.parameters.loopOut !== 'number') {
                            playObject.onended = function(e){
                                status.media = 'seeking';
                                media.play(playObject, 0);
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

                if(scene.events !== null) {
                    scheduleEvents(playObject, scene.events, function() {});
                }
                else {
                    utilities.report('[Events] No events in scene.');
                }
            });
        }

        return {
            setScene: setScene,
            process: process
        };
    })();

    //var events = (function() {
    //    // handles the events, event queue
    //    // each event has a code assigned to it -
    //    // 0 - pending
    //    // 1 - processed
    //    // 2 - ignored
    //
    //    var queue = [];
    //
    //    return {
    //        returnQueue: function() {
    //            // returns whole queue
    //            return queue;
    //        },
    //
    //        addToQueue: function(timeIn, timeOut, eventObject, ignored) {
    //            // add record
    //            if(ignored !== false) {
    //                ignored = true;
    //            }
    //            var record = [timeIn, timeOut, eventObject, ignored];
    //            queue.push(record);
    //        },
    //
    //        sortQueue: function() {
    //            if(queue.length > 1) {
    //                var repeat = false;
    //
    //                function logic() {
    //                    for (var i = 0; i < (queue.length - 1); i++) {
    //                        if (queue[i][0] > queue[i + 1][0]) {
    //                            var swap = queue[i][0];
    //                            queue[i][0] = queue[i + 1][0];
    //                            queue[i + 1][0] = swap;
    //                            repeat = true; // keep sorting
    //                        }
    //
    //                        if (i === (queue.length - 2) && repeat === true) {
    //                            repeat = false;
    //                            logic();
    //                        }
    //                    }
    //                }
    //
    //                logic();
    //            }
    //        }
    //        //update: function(index, code) {
    //        //    // check if index and code are valid, if not ignore
    //        //    // if valid, update
    //        //},
    //    };
    //})();

    var subtitles = (function() {
        var subtitlesArray = [],
            arrayPosition = 0,
            activeSubtitle = [0, 0, null, false],
            id = 'subtitle',
            container = document.createElement('div'),
            element = document.createElement('p');

        container.setAttribute('id', id);

        function parseSubtitles(url) {
            var rawSubs,
                line,
                newLine = /\n/g;

            function convertToInternalTime(string, h, m, s, ms) {
                var hours = Number(string.slice(h[0], h[1])),
                    minutes = Number(string.slice(m[0], m[1])),
                    seconds = Number(string.slice(s[0], s[1])),
                    milliseconds = Number(string.slice(ms[0], ms[1])) / 1000,
                    time = (hours * 3600) + (minutes * 60) + seconds + milliseconds;

                return time;
            }

            // support for .srt files
            function srt(array) {
                var arrayPush = [],
                    currentRecord,
                    times,
                    timeIn,
                    timeOut,
                    string = '';

                //console.log(array);
                for(var i=0; i < array.length; i++) {
                    currentRecord = array[i];
                    if(isNaN(currentRecord) === false) {
                        //if(typeof currentRecord === 'number') {
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
                        i++;
                    }
                    else {
                        string = string + ' ' + currentRecord;
                    }
                }
            }

            utilities.ajaxRequest(url, null, true, function(data) {
                rawSubs = data.match(/[^\r\n]+/g);
                if(url.endsWith('srt')) {
                    srt(rawSubs);
                }
                else {
                    return 'No valid subtitles found';
                }
            });
        }

        function checkSubtitle(time) {
            var check = subtitlesArray[arrayPosition]; // pull current record and see if it is ready
            //console.log(time, check[0]);
            if(check[0] === time || check[0] < time) {

                // check if preceding subtitle still exists, if it does, remove it
                if(activeSubtitle[3] === true) {
                    removeSubtitle();
                }

                activeSubtitle = check;
                activeSubtitle[3] = true; // set visibility flag to true
                displaySubtitle(activeSubtitle[2]); // display subtitle
                arrayPosition++;
            }
        }

        function displaySubtitle(phrase) {
            if(devOptions.verbose === 'full' || devOptions.verbose === 'minimal') {
                utilities.report('[Subtitle] ' + phrase);
            }
            element.innerHTML = phrase;
            overlay.object.appendChild(container);
            container.appendChild(element);
            media.listen(removeSubtitle);
        }

        function removeSubtitle(time) {
            function destroy() {
                activeSubtitle[3] = false;
                overlay.object.removeChild(container);
            }

            // check if time is defined
            if(time) {
                if((activeSubtitle[1] === time || activeSubtitle[1] < time) && activeSubtitle[3] === true) {
                    destroy();
                }
            }
            // if not, default behaviour is to remove subtitle
            else {
                destroy();
            }
        }

        return {
            parseSubtitles: parseSubtitles,
            checkSubtitle: checkSubtitle,
            displaySubtitle: displaySubtitle,
            removeSubtitle: removeSubtitle
        }
    })();

    // Handles media
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

        function pause(object) {
            notify.push('Video paused');
            this.poll.end();
            object.pause();
            status.control = 'paused';
        }

        function play(object, timecode) {
            if(status.media === 'video' || status.media === 'audio') {
                if(status.control === 'seeking' && typeof timecode === 'number') {
                    object.currentTime = timecode;
                    object.play();
                    object.ontimeupdate = function() {
                        // assuming we don't need this, that the listener remains
                    };
                    this.poll.run(object);
                    status.control = 'playing';
                    return;
                }

                if(object.paused === true && status.control === 'paused') {
                    // check if media was paused, if so, simply unpause

                    notify.dismiss();
                    object.play();
                    object.ontimeupdate = function() {

                    };
                    this.poll.run(object);
                    status.control = 'playing';
                    return;
                }

                else if(devOptions.mediaLoadType === 'full') {
                    // wait for video / audio to fully load
                    // show progress bar
                    notify.push('Loading');

                    object.oncanplaythrough = function() {
                        if(devOptions.verbose === 'full' || devOptions.verbose === 'minimal') {
                            console.log('[Media] Fully loaded, playing.');
                        }
                        notify.dismiss();
                        object.play();
                        watch(object);
                        status.control = 'playing';
                    }
                }

                else if(devOptions.mediaLoadType === 'progressive') {
                    // progressively load video / audio and play when enough data is loaded
                    notify.push('Loading');

                    object.oncanplay = function() {
                        if(devOptions.verbose === 'full' || devOptions.verbose === 'minimal') {
                            console.log('[Media] Partially loaded, playing.');
                        }
                        notify.dismiss();
                        object.play();
                        watch(object);
                        media.poll.run(object);
                        status.control = 'playing';
                    }
                }
            }
        }

        function listen(callback) {
            // add an event listener
            mediaObject.addEventListener('timeupdate', function() {
                callback(mediaObject.currentTime);
            });
        }

        function watch(object) {
            // everytime the timecode changes, the following series of actions are taken:
            //  - check to see if any subtitle needs displaying
            //  - check to see if a scene event needs to be fired
            object.ontimeupdate = function() {
                // I begin my watch...
                subtitles.checkSubtitle(object.currentTime);
            };
        }

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
                            if(devOptions.verbose === 'full' || devOptions.verbose === 'minimal') {
                                console.log('[Poll] Video has stopped playing.');
                            }
                            if(playBackStopState === false) { // check if it hasn't stopped before
                                if(devOptions.verbose === 'full' || devOptions.verbose === 'minimal') {
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
            }
        })();

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
            listen: listen,
            watch: watch,
            poll: poll,
            create: create
        }
    })();

    var notify = (function() {
        // lowers 'curtain' on screen and pushes notification
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
                }
            }
        };
    })();

    // Constructor function that creates instances of each scene
    var Scene = function(title, language, assets) {
        var that = this;
        this.title = title;
        this.shortName = assets.short_name;
        this.longName = assets.long_name;
        this.sceneId = utilities.cleanString(this.title);
        //this.data = assets.data;
        this.media = assets.media;
        this.subtitles = assets.media.subtitles[language];
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
    };

    // Constructor function that creates instances of each event
    var Event = function(id, call, schedule, parameters) {
        var that = this,
            plugin = new LoomSE.Modules();

        //check if the module reference exists as a function
        if(typeof plugin[call] === 'function') {
            var callModule = plugin[call]();
        }

        this.id = id; // event id
        this.call = call;
        this.status = status;
        this.in = schedule.in / 1000;
        this.out = schedule.out / 1000;
        this.parameters = parameters;
        this.run = function() {
            callModule.run(document.getElementById(overlay.id), that);
        };
        this.stop = function() {
            callModule.stop();
        };
    };

    var Event2 = function(id, call, parameters) {
        var that = this,
            plugin = new LoomSE.Modules();

        //check if the module reference exists as a function
        if(typeof plugin[call] === 'function') {
            var callModule = plugin[call]();
        }

        this.id = id; // event id
        this.call = call;
        this.status = status;
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

    publicMethods.loadSubtitles = function(url) {
        subtitles.parseSubtitles(url);
    };

    publicMethods.events = function() {
        console.log(currentScene.events);
    };

    publicMethods.notify = function(message) {
        // temporary function to test the notification function
        notify.push(message);
    };

    publicMethods.notifyDismiss = function(message) {
        // temporary function to test the notification function
        notify.dismiss();
    };

    publicMethods.eventQueue = function() {
        // temporary function to show event queue
        console.log(events.returnQueue());
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

        utilities.ajaxRequest(scriptFile, 'JSON', true, function(returnedData) {
            script = returnedData;

            minimumResolution.width = script.settings.minimum_resolution.width; // TODO check value is number
            minimumResolution.height = script.settings.minimum_resolution.height;

            // turn IDs into objects

            // TODO needs review
            root.object = document.getElementById(id.root);
            stage.object = document.getElementById(id.stage);
            mediaGroup.object = document.getElementById(mediaGroup.id);
            overlay.object = document.getElementById(overlay.id);

            // set our environment
            node.maximise(mediaGroup.object);
            node.maximise(overlay.object);
            readScript.setScene(script, firstScene);
        });
    };

    publicMethods.verbose = function() {
        devOptions.verbose = 'full'; // activate verbose mode from console
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
                media.pause(mediaObject);
                return 'Paused';
            },

            play: function() {
                media.play(mediaObject);
                return 'Playing';
            },

            scrub: function(time) {
                // scrub to time in media
                status.control = 'seeking';
                media.play(mediaObject, time);
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