// displays current media time on screen

LoomSE.Modules.prototype.jump = function() {

};

LoomSE.Modules.prototype.loop = function() {
    // loops video between in and out points

    return {
        run: function(target, data) {
            Loom.control.scrub(data.out);
        },
        stop: function() {

        }
    }
};


LoomSE.Modules.prototype.mediaTime = function() {
    // add an on screen timer
    // time linked to media time

    var update;

    return {
        run: function(target, data) {
            if(data.status.media === 'video' || data.status === 'audio') {
                var currentMedia = document.getElementById(data.status.id),
                    currentMediaTime = currentMedia.currentTime,
                    clock = setClock(currentMediaTime),
                    xy = LoomSE.Modules.locatePerc(data.parameters.x, data.parameters.y),
                    element = document.createElement('div'),
                    child = document.createElement('span');

                //console.log(clock);

                element.id = data.id;

                if(data.parameters.class !== null) {
                    element.setAttribute('class', data.parameters.class);
                }

                element.appendChild(child);

                updateTime();

                LoomSE.Modules.draw(target, element, xy);

                update = setInterval(
                    function() {
                        updateTime();
                    }, 250
                );
            }

            function updateTime() {
                currentMediaTime = currentMedia.currentTime;
                clock = setClock(currentMediaTime);
                child.innerHTML = clock.hours + ':' + clock.minutes + ':' + clock.seconds + ':' + clock.split;
            }

            function setClock(time) {
                var remainder = time,
                    hours,
                    minutes,
                    seconds,
                    split;

                if(remainder >= 3600) {
                    hours = Math.floor(remainder / 3600);
                    remainder = remainder - (hours * 3600);
                }
                else {
                    hours = 0;
                }

                if(remainder >= 60) {
                    minutes = Math.floor(remainder / 60);
                    remainder = remainder - (minutes * 60);
                }
                else {
                    minutes = 0;
                }

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
                }
            };
        },
        stop: function() {
            clearInterval(update);
        }
    };
};

// returns a pixel position from a %

LoomSE.Modules.locatePerc = function(percentage_x, percentage_y) {
    // using a co-ordinate system of %, place objects on screen

    var dimensions = getDimensions(),
        pixel_x = (dimensions[0] / 100 * percentage_x),
        pixel_y = (dimensions[1] / 100 * percentage_y);

    return [pixel_x, pixel_y];

    function getDimensions() {
        var availableWidth = window.innerWidth,
            availableHeight = window.innerHeight;

        return [availableWidth, availableHeight];
    }
};

// output to the screen

LoomSE.Modules.draw = function(target, element, xy, how) {

    target.appendChild(element);

    LoomSE.Modules.setCSS(element, {
        position: 'absolute',
        left: xy[0],
        top: xy[1]
    });
};

LoomSE.Modules.setCSS = function(element, object) {
    for (var attribute in object) {
        var value = object[attribute];

        switch (attribute) {
            case 'width':
            case 'height':
            case 'top':
            case 'left':
            case 'right':
            case 'bottom':
            case 'padding':
            case 'padding-left':
            case 'padding-right':
            case 'padding-top':
            case 'padding-bottom':
                value = value + 'px';
        }
        element.style[attribute] = value;
    }
};