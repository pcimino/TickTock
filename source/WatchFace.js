var TimeDelay = {defaultDelay : 0, runFlag :false, id: 0};

enyo.kind({
	name:"TopWatchDial",
	kind:"Control",
	components: [],
    timerText: {},
    splitText: {},
	published: {
		hour:0,
		minute:0,
		second:0,
		milliSec:0,
		startTime:0,
		timerRunning: false,
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
	rendered: function() {
		this.inherited(arguments);
		dialRef = this;
		dialRef.displayTime();
	},
  loop: function() {  // try this if Monitor doesn't work
    if (TimeDelay.runFlag) {
      var elapsed = new Date().getTime() - dialRef.startTime;
      dialRef.milliSec = elapsed % 1000;
      dialRef.second = parseInt(elapsed / 1000) % 60;
      dialRef.minute = parseInt(elapsed / 60000) % 60;
      dialRef.hour = parseInt(elapsed / 3600000) % 12;
      dialRef.g_timeStr = dialRef.timeString();
      dialRef.displayTime();
    } else {
        clearInterval(TimeDelay.id);
    }
  },
  startLoop: function() {  // try this if Monitor doesn't work
    TimeDelay.runFlag = true;
    TimeDelay.id = setInterval(this.loop, TimeDelay.defaultDelay);
  },
    destroy: function() {
		this.inherited(arguments);
        stopTimer();
	},
	startTimer: function() {
		dialRef.timerRunning = true;
        dialRef.startTime = new Date().getTime();
		dialRef.hour = 0;
		dialRef.minute = 0;
		dialRef.second = 0;
		dialRef.milliSec = 0;
		dialRef.g_timeStr = '00:00:00.000';
		dialRef.displayTime();
		dialRef.displaySplitTime();
		TimeDelay.runFlag = true;
        dialRef.displayTime();
        this.startLoop();
	},
	splitTimer: function() {
		if (TimeDelay.runFlag) {
			dialRef.g_timeStr = dialRef.timeString();
			dialRef.displaySplitTime();
			dialRef.displaySplitTime();
		} else {
			dialRef.displaySplitTime();
		}
	},
	stopTimer: function() {
		TimeDelay.runFlag = false;
		dialRef.timerRunning = false;
        var elapsed = new Date().getTime() - dialRef.startTime;
        dialRef.milliSec = elapsed % 1000;
        dialRef.second = parseInt(elapsed / 1000) % 60;
        dialRef.minute = parseInt(elapsed / 60000) % 60;
        dialRef.hour = parseInt(elapsed / 3600000) % 12;
        dialRef.g_timeStr = dialRef.timeString();
        dialRef.displaySplitTime();
        dialRef.displayTime();
		
	},
	resetTimer: function() {
		dialRef.hour = 0;
		dialRef.minute = 0;
		dialRef.second = 0;
		dialRef.milliSec = 0;
		TimeDelay.runFlag = false;
		dialRef.displayTime();
		dialRef.$.splitText.setContent('00:00:00.000');
        dialRef.$.timerText.setContent('00:00:00.000');
	},
	displayTime: function() {
		dialRef.$.timerText.setContent(dialRef.g_timeStr);
	},
	displaySplitTime: function() {
		dialRef.$.splitText.setContent(dialRef.g_timeStr);
        var id = topWatchRef.getNextId();
        topWatchRef.addSplit({"id": " " + id, value: dialRef.g_timeStr});
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