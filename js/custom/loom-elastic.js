// interface plugin for Loom
// dependencies, snap.svg

Loom.Plugin.prototype.activeEvent = function(data) {
    Elastic.activeEvent(document.getElementById('loom_overlay'), data);
};

var Elastic = (function () {

	var publicMethods = {};

    publicMethods.set = function() {
        window.addEventListener('resize', function(){
            resize();
        }, false);

        function resize(){
            // API Loom.reload();

            // check if anything to resize
            //var parent = document.getElementById('elastic_activeEvent_parent');
            //if(parent !== null && parent.hasChildNodes() === true){
            //    console.log('resizing');
            //    var children = parent.childNodes;
            //    for(var i=0; i < children.length; i++){
            //        var child = children[i],
            //            baseSize = child.baseSize,
            //            position = child.position;
            //
            //        setCSS(child, {
            //            width: baseSize * scale(),
            //            height: baseSize * scale()
            //            //'padding-left': child.padding,
            //            //position: 'absolute',
            //            //right: (child.position) * (child.width + child.padding),
            //            //top: 0
            //        });
            //        var snap = Snap(children[i].firstChild),
            //            selection = snap.select('g.childSpriteTopGroup'),
            //            spriteMatrix = new Snap.Matrix();
            //        spriteMatrix.scale(scale(), scale());
            //        selection.transform(spriteMatrix);
            //    }
            //}
        }
    };

	publicMethods.activeEvent = function(target, data) {
        var parent,
            child,
            parentName = 'elastic_activeEvent_parent',
            childName = 'elastic_activeEvent_child',
            childId;

        if (document.getElementById(parentName) === null) {
            activeEventCount.reset();
        }
        else if (document.getElementById(parentName).hasChildNodes() === false){
            target.removeChild(document.getElementById(parentName));
            activeEventCount.reset();
        }
        else {
            activeEventCount.add();
        }

        childId = childName + '_' + activeEventCount.value();
        child = new ChildToken(data, loadSprite(data.parameters.graphic), activeEventCount.value(), childId, 'childSprite');
        parent = new Parent(parentName);

        child.entrance = function() {
            // animate SVG paths
            var that = this;

            that.background.animate({
                    r: that.width / 2
                }, (that.entranceTime / 2), mina.bounce,
                function(){
                    that.path.animate({
                            opacity: that.commonAttr.bright
                        }, (that.entranceTime / 2), mina.linear,
                        function(){
                            if(that.hasTimer === true){
                                var bbox = that.path.getBBox(),
                                    centreX = bbox.width / 4,
                                    centreY = bbox.height / 4,
                                    pathMatrix = new Snap.Matrix();
                                pathMatrix.translate(centreX, centreY);
                                pathMatrix.scale(0.8, 0.8);
                                that.path.animate({
                                        transform: pathMatrix
                                    }, 300,
                                    function(){
                                        setTimeout(function() {
                                            that.addTimer(that.group, that.width, that.expiresAfter, function () {child.destroy(parent.element, child.element)});
                                        }, 200);
                                    }
                                );
                            }
                        }
                    );
                }
            );
        };

        child.addTimer = function(element, size, time, callback) {
            var arc = element.path(),
                arcStroke = size * 0.1,
                centre = size / 2,
                radius = (size - arcStroke) / 2,
                startY = centre - radius,
                startpoint = (99/100) * 360;

            Snap.animate(0, startpoint,
                function (degrees) {
                    animateArc(degrees, true);
                }, 300, mina.easein,
                function(){
                    Snap.animate(startpoint, 0,
                        function (degrees) {
                            animateArc(degrees, false);
                        }, time, mina.linear, callback
                    );
                }
            );

            function animateArc(degrees, charge) {
                // charge boolean: true when 'winding up', false when 'released'

                // credit goes to Rachel Smith
                // http://codepen.io/rachsmith/pen/BqpCd

                arc.remove();

                var radians = Math.PI * (degrees - 90) / 180,
                    endX = centre + radius * Math.cos(radians),
                    endY = centre + radius * Math.sin(radians),
                    largeArc = degrees > 180 ? 1 : 0,
                    path = "M" + centre + "," + startY + " A" + radius + "," + radius + " 0 " + largeArc + ",1 " + endX + "," + endY;

                arc = element.path(path);

                arc.attr({
                    stroke: '#ffffff',
                    fill: 'none',
                    strokeWidth: arcStroke,
                    opacity: child.commonAttr.bright
                });

                if(charge === false && degrees <= 90){
                    element.attr({
                        //opacity: (degrees / 90)
                    });
                }

                if(charge === false && degrees === 0){
                    element.remove();
                }
            }
        };

        initialise();

        function ChildToken(object, sprite, position, id, css) {
            if(object) {
                if(object.parameters.hasTimer === true) {
                    this.hasTimer = true;
                    this.expiresAfter = object.out;
                }
                else {
                    this.hasTimer = false;
                }
                this.graphic = object.parameters.graphic;
            }
            this.baseSize = 100; // default size before scaling
            this.width = this.baseSize * scale(); // calculated size
            this.centre = this.width / 2;
            this.padding = 10;
            this.entranceTime = 500; // time it takes for entrance animation
            this.commonAttr = {
                fill: '#ffffff',
                bright: 0.7,
                dim: 0.1
            };
            // DOM node
            this.element = document.createElement('div');
            this.element.position = position;
            this.element.baseSize = this.baseSize;
            this.element.setAttribute('class', css);
            this.element.setAttribute('id', id);
            // Snap
            this.snap = Snap('100%', '100%');
            this.group = this.snap.group();
            this.group.attr({
               class: 'childSpriteTopGroup'
            });
            this.path = this.group.path(sprite);
            this.path.attr({
                fill: this.commonAttr.fill,
                opacity: this.commonAttr.bright
            });
            this.background = this.group.circle(this.centre, this.centre, 0);
            this.background.attr({
                fill: this.commonAttr.fill,
                opacity: this.commonAttr.dim
            });
        }

        ChildToken.prototype.destroy = function(parent, child) {
            //parent.removeChild(child);
        };

        function initialise(){
            target.appendChild(parent.element);
            Snap(child.element).append(child.snap);
            parent.element.appendChild(child.element);

            setCSS(parent.element, {
                //width: (child.width + child.padding) * activeEventCount.value(),
                //height: child.width * 2.5,
                position: 'absolute',
                right: child.width,
                top: window.innerHeight - (child.width * 1.5)
            });

            setCSS(child.element, {
                width: child.width,
                height: child.width,
                'padding-left': child.padding,
                position: 'absolute',
                right: (child.element.position) * (child.width + child.padding),
                top: 0
            });

            child.entrance();
        }
	};
    publicMethods.title = function() {

    };

    // Private functions
    function assetCounter() {
        var counter = 0;
        return {
            reset: function() {
                counter = 0;
            },
            add: function() {
                counter++;
            },
            value: function() {
                return counter;
            }
        };
    }

    var activeEventCount = new assetCounter();

    var scale = (function() {
        var thresholds = {
            small: {
                res: 500,
                scale: 0.5
            },
            medium: {
                res: 700,
                scale: 1
            },
            large: {
                res: 900,
                scale: 1.2
            }
        };

        return function() {
            // check we are in landscape
            var value;
            if (window.innerHeight < window.innerWidth) {
                if (window.innerHeight < thresholds.small.res) {
                    value = thresholds.small.scale;
                }
                if (window.innerHeight > thresholds.small.res && window.innerHeight <= thresholds.medium.res) {
                    value = thresholds.medium.scale;
                }
                if (window.innerHeight > thresholds.medium.res) {
                    value = thresholds.large.scale;
                }
            }
            // else if in portrait
            else {
                if (window.innerWidth < thresholds.small.res) {
                    value = thresholds.small.scale;
                }
                if (window.innerWidth > thresholds.small.res && window.innerHeight <= thresholds.medium.res) {
                    value = thresholds.medium.scale;
                }
                if (window.innerWidth > thresholds.medium.res) {
                    value = thresholds.large.scale;
                }
            }
            return value;
        };
    })();

    function Parent(name) {
        var element;

        this.id = name;

        if (document.getElementById(this.id) === null) {
            // if parent does not exist
            element = document.createElement('div');
            element.setAttribute('id', this.id);
            if (this.css){
                element.setAttribute('css', this.css);
            }
        }
        else {
            element = document.getElementById(this.id);
        }

        this.element = element;
    }

    function loadSprite(name) {
        switch(name){
            case 'phone':
                var svg = 'M73.932,85.041c0.32-1.03,0.131-2.141-0.522-3.073l-9.342-14.402l-0.078-0.115c-0.398-0.542-0.946-0.993-1.58-1.31 c-1.109-0.554-2.377-0.661-3.479-0.291l-5.857,1.956c-0.246,0.076-0.906,0.034-1.075-0.042c-0.044-0.025-4.382-2.595-8.529-15.015 c-4.141-12.395-2.238-17.083-2.241-17.084c0.12-0.23,0.617-0.659,0.863-0.745l4.993-1.667c1.761-0.589,3.086-2.365,3.144-4.223 l-0.445-17.513c0.016-1.367-0.684-2.565-1.836-3.14c-0.815-0.407-1.77-0.462-2.691-0.155l-13.6,4.527 c-1.304,0.433-2.809,1.571-3.582,2.708c-0.37,0.542-8.922,13.642,0.623,42.226c8.104,24.261,20.095,31.819,23.58,33.558l0,0 c0.751,0.375,1.214,0.539,1.305,0.569c1.295,0.442,3.181,0.45,4.479,0.016l13.601-4.54C72.77,86.91,73.598,86.095,73.932,85.041z';
            case 'caution':
            default:
                if(!svg){
                    throw 'Sprite not set or invalid sprite';
                    break;
                }
                return svg;
        }
    }

    function setCSS(element, object) {
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
    }

    return publicMethods;
}());