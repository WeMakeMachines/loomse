// Author: Franco Speziali
var lookAway = {};

function initialise(){
	// first we determine our environment
	global.device = checkEnvironment();
	foundPhone.position = '11';
	foundPhone.size = '44';
	foundPhone.loadGraphics('images/phone-01c-front.svg','#stage', function(){
		foundPhone.SVGroot = Snap('#artel-front');
		foundPhone.screensSVGroot = '#screens';
		foundPhone.persistSVGroot = '#screen-persists';
		foundPhone.caseKeys();
		foundPhone.screenGraphicHandler();
		foundPhone.screenGraphicHandler('#unlock');
		//processPhoneQueue();
	});
}

var encryption = [];
encryption.letter = "Dear Mr Kerkwike,\nWe're not taking about three.\nWe're talking about 400 missing documents.";
//encryption.encryptedLetter = encryption.scramble(encryption.letter);
encryption.scramble = function(variable){
	var temp = '';
	for(i=0;i<variable.length;i++){
		var charCode = variable.charCodeAt(i);
		//var checkForEscape = char
		if(charCode === 116){
			console.log('whhoo');
			i++;
			break;
		}
		else {
			charCode++;
			console.log(charCode,variable[i]);
			temp = temp + String.fromCharCode(charCode);
		}
	}
	return temp;
};

//
// Here we build the foundPhone object
//
var foundPhone = new VirtualPhone();
foundPhone.pin = '9999';
foundPhone.power = true;
foundPhone.eventQueue = [
	{obj: foundPhone, prop: 'clear_screen', args: []},
	{obj: foundPhone, prop: 'boot', args: ['#loading','#unlock','4000']},
	{obj: foundPhone, prop: 'unlock', args: []}
];
foundPhone.processEventQueue = function(queueItems){
	var currentPhoneEvent = this.eventQueue[0];
	currentPhoneEvent.obj[currentPhoneEvent.prop].apply(currentPhoneEvent.obj, currentPhoneEvent.args);
	foundPhone.eventQueue.shift();
};
// specify the buttons (graphic id and corresponding action or value) for the unlock screen
foundPhone.unlock.keys = ajaxRequest('data/foundPhone/unlock.keys.json','json',false);
foundPhone.screenGraphicHandler = function(id,hold){
	// handles the graphics on the screen
	// id = graphical id to show (optional)
	if (typeof this.SVGroot === 'undefined'){
		displayError('Function: screenGraphicHandler\nMessage: screenSVGroot not defined');
	}
	else {
		// first we check to see what parameters have been passed
		if (id == null && hold == null){
			foundPhone.clearScreen();
		}
		if (id == null && hold != null){
			setTimeout(function(){
				foundPhone.clearScreen();
			}, hold);
		}
		if (id != null && hold == null){
			foundPhone.loadScreen(id);
		}
		if (id != null && hold != null){
			setTimeout(function(){
				foundPhone.loadScreen(id);
			}, hold);
		}
	}
};
foundPhone.clearScreen = function(){
	this.SVGroot.selectAll(foundPhone.screensSVGroot + ' > g').attr({'display': 'none'});
	this.SVGroot.selectAll(foundPhone.persistSVGroot + ' > g').attr({'display': 'none'});
};
foundPhone.loadScreen = function(id){
	this.SVGroot.selectAll(foundPhone.persistSVGroot + ' > g').attr({'display': 'inline'});
	this.SVGroot.select(id).attr({'display': 'inline'});
};
// collects data from the phonebook
foundPhone.phonebook = ajaxRequest('data/foundPhone/phonebook.json','json',false);
foundPhone.switchOff = function(){
	var phoneEventQueue = [
		{obj: foundPhone, prop: 'clear_screen', args: []}
	];
	this.power = false;
	processPhoneQueue();
};
foundPhone.switchOn = function(){
	var phoneEventQueue = [
		{obj: foundPhone, prop: 'clear_screen', args: []},
		{obj: foundPhone, prop: 'boot', args: ['#loading','#unlock','4000']},
		{obj: foundPhone, prop: 'unlock', args: []}
	];
	console.log('a' + phoneEventQueue);
	this.power = true;
	processPhoneQueue();
};
foundPhone.caseKeys = function(){
	document.getElementById('power').addEventListener('click', function(){foundPhone.powerButton();});
};

// the phone's event queue
//var phoneEventQueue = [
//	{obj: foundPhone, prop: 'clear_screen', args: []},
//	{obj: foundPhone, prop: 'boot', args: ['#loading','#unlock','4000']},
//	{obj: foundPhone, prop: 'unlock', args: []}
//];

function processNextQueueItem() {
    /*if (taskQueue.length == 0)
        return;
    nextTask = taskQueue[0];
     remove [0] from array

    run nextTask(processNextQueueItem);*/
}

function checkEnvironment(){
	// first check users device meets the minimum requirements
	// check available resolution
	//if(window.inner){
	//
	//}
	return;
}

function checkDevice(){
	//if ();
}

function updatePhoneQueue(){

}

function processPhoneQueue(){
	console.log('b' + phoneEventQueue);
	var length = phoneEventQueue.length;
	// decided not to use forEach here, because I wanted each [0] to be removed
	for(i=0; i<length; i++)
	{
		var currentPhoneEvent = phoneEventQueue[0];
		currentPhoneEvent.obj[currentPhoneEvent.prop].apply(currentPhoneEvent.obj, currentPhoneEvent.args);
		phoneEventQueue.shift();
	}
}

function VirtualPhone(){
	// expect keys, pin, screenSVGroot
	this.position;
	this.size;
	this.screen;
	this.orientation = 'front';
	this.availableScreens = {loading: {id: ''}, messages: {id: ''}, unlock: {id: ''}, incoming_call: {id: ''}, outgoing_call: {id: ''}, off: {}};
	this.background;
	this.glass;
	this.camera;
	this.status = {messages: 0, calls: 0, gps: 1, signal: 4, battery: 5, time: {hour: 0, minute: 0}};
	this.powerButton = function(){
		switch (this.power){
			case true:
			// switch phone off
			console.log('Switching off...');
				this.switchOff();
			break;
			case false:
			// switch phone on
			console.log('Switching on...');
				this.switchOn();
			break;
		}
	};
	this.loadGraphics = function(file,container,callback){
		Snap.load(file, function (loadedFragment){
			Snap(container).append(loadedFragment);
            callback();
		});
	};
	this.boot = function(id1,id2,delay){
		// id1 > delay > id2
		$(id1).attr({'display': 'inline'});
		setTimeout(function(){
			$(id1).attr({'display': 'none'});
			$(id2).attr({'display': 'inline'});
		}, delay);
	};
	this.interval = function(delay, id){
		// creates a graphic interval based on
		$(id1).attr({'display': 'inline'});
		setTimeout(function(){
			$(id1).attr({'display': 'none'});
			$(id2).attr({'display': 'inline'});
		}, delay);
	};
	this.unlock = function(){
		// expects keys
		if (typeof this.unlock.keys === 'undefined'){
			displayError('Function: unlock\nMessage: keypad not defined');
		}
		else {
			this.unlock.keys.forEach(function(value, index){
				document.getElementById(value.id).addEventListener('click', function(){console.log('activated ' + value.id);});
				var currentElement = Snap('#' + value.id);
				currentElement.addClass('phoneButtons');
			});
		}
	};
	this.messages = function(){

	};
	this.call_log = function(){

	};
	this.incoming_call = function(name){

	};
	this.outgoing_call = function(){

	};
	this.clear_screen = function(){
		// expects screenSVGroot
		// will hide each group (g) from each element (id) in the list
		// warning! Do not use nested groups (g) inside groups. They may not come back :)
		// Another solution would be to prefix a class to all groups (g) that need to be hidden, then target
		// them accordingly.
		if (typeof this.screenSVGroot === 'undefined'){
			displayError('Function: clear_screen\nMessage: screenSVGroot not defined');
		}
		else {
			this.screenSVGroot.forEach(function(id){
				$(id + '> g').attr({'display': 'none'});
			});
		}
	};
}

function ajaxRequest(file,dataType,async){
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
			displayError(errorMessage);
		},
		success: function(response){
			data = response;
		}
	});
	return data;
}

function displayError(errorMessage){
	var errorText = '\n*** Error ***\n';
	console.log(errorText + errorMessage);
}