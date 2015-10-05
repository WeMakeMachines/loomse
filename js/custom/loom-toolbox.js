// interface plugin for Loom
// dependencies, snap.svg

Loom.Plugin.prototype.tbTime = function(data) {
    if(data.status.media === 'video' || data.status === 'audio'){
        console.log('audiovideo');
    }

    //data.status.
    //toolbox.activeEvent(document.getElementById('loom_overlay'), data);
};

var toolbox = (function() {
    var private = {}; //Private

    //Private method
    function privateWay() {
    }

    //Public property
    var publicProp = {};

    publicProp.property = 'Bacon Strips';

    //Public method
    publicProp.method = function() {
    };

    //Return just the public parts
    return publicProp;
}());