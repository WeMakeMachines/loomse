// displays current media time on screen

loomSE.Modules.prototype.loop = function() {
    // loops video between in and out points

    return {
        run: function(container) {
            loomSE.control.scrub(container.loomSE_schedule.out);
        },
        stop: function() {

        }
    }
};

loomSE.Modules.prototype.mediaTime = function() {
    // add an on screen timer
    // time linked to media time

    var update;

    return {
        run: function(container) {
            var clock,
                element = document.createElement('span');

            function updateTime() {
                clock = loomSE.currentTime.object();
                element.innerHTML = clock.hours + ':' + clock.minutes + ':' + clock.seconds + ':' + clock.split;
            }

            container.appendChild(element);
            updateTime();

            // position our event
            if(typeof container.loomSE.position === 'function') {
                container.loomSE.position();
            }

            update = setInterval(
                function() {
                    updateTime();
                }, 250
            );
        },
        stop: function() {
            clearInterval(update);
        }
    };
};