// displays current media time on screen

Loom.Modules.prototype.mediaTime = function() {
    var update;

    return {
        run: function(target, data) {
            if(data.status.media === 'video' || data.status === 'audio') {
                var thisName = 'mediaTime',
                    currentMedia = document.getElementById(data.status.id),
                    //currentMediaTime = currentMedia.currentTime,
                    xy = Loom.Modules.locatePerc(data.parameters.x, data.parameters.y),
                    element = document.createElement('div'),
                    child = document.createElement('span');

                element.id = data.id;

                if(data.parameters.class !== null) {
                    element.setAttribute('class', data.parameters.class);
                }

                element.appendChild(child);

                Loom.Modules.draw(target, element, xy);

                update = setInterval(
                    function() {
                        var currentMediaTime = currentMedia.currentTime;
                        child.innerHTML = currentMediaTime;
                    }, 250
                );
            }
        },
        stop: function() {
            console.log('stopping ' + update);
            clearInterval(update);
        }
    };
};

// returns a pixel position from a %

Loom.Modules.locatePerc = function(percentage_x, percentage_y) {
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

Loom.Modules.draw = function(target, element, xy, how) {

    target.appendChild(element);

    Loom.Modules.setCSS(element, {
        position: 'absolute',
        left: xy[0],
        top: xy[1]
    });
};

Loom.Modules.setCSS = function(element, object) {
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