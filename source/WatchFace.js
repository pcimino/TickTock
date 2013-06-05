var TimeDelay = {defaultDelay : 5, runFlag :false};
var heightMargin = 250;
var circleScale = .4;

enyo.kind({
	name:"TopWatchDial",
	kind:"Control",
	components: [],
    timerText: {},
    splitText: {},
	published: {
		g_beta:0,
		g_width:280,
		g_height:350,
		hour:0,
		minute:0,
		second:0,
		milliSec:0,
		startTime:0,
		timerRunning: false,
		g_change: 4,
		g_timeStr:"00:00:00.000"
	},
  create: function() {
    this.inherited(arguments);
    this.setupBodyContent();
  },
  setupBodyContent: function() {
    this.createComponent({name:'bodyContainer', fit: true, classes: "enyo-center body-margin"});
    this.$.bodyContainer.createComponent({tag:'br'});
    this.$.bodyContainer.createComponent({tag:'br'});
    this.$.bodyContainer.createComponent({tag:'br'});
    this.$.bodyContainer.createComponent({ name: "clockBackground", classes: "clock-background"});
    this.$.bodyContainer.$.clockBackground.createComponent({kind: enyo.Control, name:"timerText", content :"00:00:00.000", classes: "clock-box"});
    this.$.timerText = this.$.bodyContainer.$.clockBackground.$.timerText;
    this.$.bodyContainer.createComponent({tag:'br'});
    this.$.bodyContainer.createComponent({name: "splitBackground", classes: "small-clock-background"});
    this.$.bodyContainer.$.splitBackground.createComponent({kind: enyo.Control, name:"splitText", content :"00:00:00.000", classes: "small-clock-box"});
    this.$.splitText = this.$.bodyContainer.$.splitBackground.$.splitText;
  },
	setupAnimation: function() {
		this.loopStart = Date.now();
		this.start = Date.now();
		// (re)start loop
		enyo.asyncMethod(this,"loop");
	},
	rendered: function() {
		this.inherited(arguments);
		dialRef = this;
		this.setupAnimation();


		TimeDelay.monitorFlag = function() {
			var elapsed = new Date().getTime() - dialRef.startTime;
			dialRef.milliSec = elapsed % 1000;
			dialRef.second = parseInt(elapsed / 1000) % 60;
			dialRef.minute = parseInt(elapsed / 60000) % 60;
			dialRef.hour = parseInt(elapsed / 3600000) % 12;
			dialRef.displayTime();
			if (TimeDelay.runFlag) {
				setTimeout(function() {
					TimeDelay.monitorFlag();
				},TimeDelay.defaultDelay);
			}
		};

	},
	setupCanvasSize: function() {
		dialRef.$.timerLayer.destroyClientControls();
		dialRef.$.watchFace.destroyClientControls();
		dialRef.g_width = getWidth();
		dialRef.g_height = getHeight();
		dialRef.$.canvas.setAttribute("width", dialRef.g_width);
		dialRef.$.canvas.setAttribute("height", dialRef.g_height);
		dialRef.g_width = getWidth();
		dialRef.g_height = getHeight();
		var largeDialRadius = dialRef.g_width;
		if (dialRef.g_height < largeDialRadius) largeDialRadius = dialRef.g_height - heightMargin;
		largeDialRadius = circleScale * largeDialRadius;
		dialRef.drawDial(dialRef.milliColor, dialRef.secColor, dialRef.minColor, dialRef.hourColor, dialRef.centerColor, largeDialRadius);
	},
	destroy: function() {
		this.inherited(arguments);
    stopTimer();
	},
	drawDial: function() {
		dialRef.$.timerText.setContent("00:00:00:000");
		dialRef.$.splitText.setContent("00:00:00:000");
	},
	loop: function() {
		dialRef.displayTime();
		this.start = Date.now();
		startTimer();
	},
	startTimer: function() {
		dialRef.timerRunning = true;
		dialRef.hour = 0;
		dialRef.minute = 0;
		dialRef.second = 0;
		dialRef.milliSec = 0;
		dialRef.g_timeStr = '00:00:00.000';
		dialRef.displayTime();
		dialRef.displaySplitTime();
		TimeDelay.runFlag = true;
		dialRef.startTime = new Date().getTime();
		TimeDelay.monitorFlag();
	},
	splitTimer: function() {
		if (TimeDelay.runFlag) {
			dialRef.g_timeStr = dialRef.timeString();
			dialRef.displaySplitTime();
			var id = topWatchRef.getNextId();
			topWatchRef.addSplit({"id": " " + id, value: dialRef.g_timeStr});
		} else {
			dialRef.displaySplitTime();
			var id = topWatchRef.getNextId();
			topWatchRef.addSplit({"id": " " + id, value: dialRef.g_timeStr});
		}
	},
	stopTimer: function() {
		TimeDelay.runFlag = false;
		dialRef.timerRunning = false;
		dialRef.g_timeStr = dialRef.timeString();
		dialRef.displayTime();
		var id = topWatchRef.getNextId();
		topWatchRef.addSplit({"id":id, value: dialRef.g_timeStr});
		dialRef.displaySplitTime();
	},
	resetTimer: function() {
		dialRef.hour = 0;
		dialRef.minute = 0;
		dialRef.second = 0;
		dialRef.milliSec = 0;
		TimeDelay.runFlag = false;
		dialRef.$.timerText.setContent('00:00:00.000');
		dialRef.$.splitText.setContent('00:00:00.000');
		dialRef.cleanup();
	},
	cleanup: function() {
		dialRef.g_timeStr = '00:00:00.000';
		dialRef.$.timerLayer.destroyClientControls();
		dialRef.$.timerLayer.destroyClientControls();
	},
	displayTime: function() {
		dialRef.$.timerText.setContent(dialRef.g_timeStr);
		topWatchRef.displayTime(dialRef.g_timeStr);
	},
	displaySplitTime: function() {
		dialRef.$.splitText.setContent(dialRef.g_timeStr);
	},
	timeString: function() {
		var milliSecStr = "000" + dialRef.milliSec;
		milliSecStr = milliSecStr.substring(milliSecStr.length - 3);
		return dialRef.pad(dialRef.hour) + ":" + dialRef.pad(dialRef.minute) + ":" + dialRef.pad(dialRef.second) + "." + milliSecStr;
	},
	pad: function(number) {
		var numStr = "0" + number;
		return numStr.substring(numStr.length - 2);
	}
});