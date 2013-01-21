var TimeDelay = {defaultDelay : 5, runFlag :false};
var heightMargin = 250;

enyo.kind({
	name:"TopWatchDial",
	kind:"Control",
	components: [
		{kind:"enyo.Canvas", attributes: {width: 280, height: 300}, components: [
			{name: "watchFace", kind: "canvas.Control"},
			{name: "timerLayer", kind: "canvas.Control"},
			{name:"timerText", kind: "enyo.canvas.Text", bounds: {l: 0, t: 0}, color: "black", font: "36pt Arial"},
			{name:"splitText", kind: "enyo.canvas.Text", bounds: {l: 0, t: 0}, color: "black", font: "36pt Arial"}
		]}
	],
	published: {
		g_beta:0,
		g_width:280,
		g_height:300,
		hour:0,
		minute:0,
		second:0,
		milliSec:0,
		startTime:0,
		timerRunning: false,
		firstTime: true,
		g_change: 4,
		g_timeStr:"00:00:00.000",
		milliColor:"DE1D43", secColor:"34308B", minColor:"2DAA4A", hourColor:"201C5A",centerColor:"86D0F4"
	},
	setupAnimation: function() {
		// pause loop to update the balls
		if (this.cancel) {
			enyo.cancelRequestAnimationFrame(this.cancel);
		}
		this.loopStart = Date.now();
		this.frame = 0;
		this.start = Date.now();
		// (re)start loop
		enyo.asyncMethod(this,"loop");
	},
	rendered: function() {
		this.inherited(arguments);
		dialRef = this;
		this.setupAnimation();
		
		window.addEventListener("devicemotion", function(event) {
			  // Process event.acceleration, event.accelerationIncludingGravity,
			  // event.rotationRate and event.interval
		  }, true);
		  
		window.addEventListener("deviceorientation", dialRef.handleRotateCanvas.bind(dialRef), true);

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
		
		this.setupCanvasSize();
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
		largeDialRadius = .4 * largeDialRadius;
		dialRef.drawDial(dialRef.milliColor, dialRef.secColor, dialRef.minColor, dialRef.hourColor, dialRef.centerColor, largeDialRadius);
	},
	handleRotateCanvas: function(event) {
		/*  General purpose handling
		http://dev.w3.org/geo/api/spec-source-orientation
			event.alpha
			event.beta
			event.gamma
		*/
		var change = false;
		var y = 0;

		/*  General purpose handling
			http://dev.w3.org/geo/api/spec-source-orientation
			event.alpha
			event.beta
			event.gamma
		*/
		y = event.beta;
		if (y > 45 || y < -45) {
			if (dialRef.g_beta != 90) {
				dialRef.g_beta = 90;
				change = true;
			}
		} else {
			if (dialRef.g_beta != 0) {
				dialRef.g_beta = 0;
				change = true;
			}
		}

		if (change) {
			dialRef.g_change = 0;
		}
    },
	destroy: function() {
		if (this.cancel) {
			enyo.cancelRequestAnimationFrame(this.cancel);
		}
		this.inherited(arguments);
	},
	drawDial: function(milliColor, secColor, minColor, hourColor, centerColor, outerRadius) {
		var canvasCenterX = dialRef.g_width/2;
		var canvasCenterY = -20 + (dialRef.g_height - heightMargin)/2;
		var left = canvasCenterX;
		var top = canvasCenterY;
		dialRef.$.timerText.setBounds({l: left-240, t: dialRef.g_height - (heightMargin + 15)});
		dialRef.$.timerText.setText("Elapsed: 00:00:00:000");
		dialRef.$.splitText.setBounds({l: left-160, t: (dialRef.g_height - (heightMargin - 25))});
		dialRef.$.splitText.setText("Split: 00:00:00:000");
		dialLabel = "Draw Dial :" + canvasCenterX+", "+canvasCenterY+", "+ outerRadius;

		var dialWidth = outerRadius/5;
		// Milli seconds
		dialRef.drawIndicator(canvasCenterX, canvasCenterY, outerRadius, dialWidth, milliColor, 101, 2, 16);
		outerRadius -= dialWidth + 5;

		// Seconds
		dialRef.drawIndicator(canvasCenterX, canvasCenterY, outerRadius, dialWidth, secColor, 12, 4, 3);
		outerRadius -= dialWidth + 5;
		
		// Minutes
		dialRef.drawIndicator(canvasCenterX, canvasCenterY, outerRadius, dialWidth, minColor, 12, 6, 2);
		outerRadius -= dialWidth + 5;

		// Hours
		dialRef.drawIndicator(canvasCenterX, canvasCenterY, outerRadius, dialWidth, hourColor, 12, 8, 1);
		outerRadius -= dialWidth + 5;
		// Center
		dialRef.$.watchFace.createComponent({
			kind: "tld.Shape2D.Arc",
			lineWidth: 2,
			outlineColor: centerColor,
			color: centerColor,
			x: canvasCenterX, 
			y: canvasCenterY, 
			radius: outerRadius, 
			startAngle: -90, 
			endAngle: 270,
			antiClockwise:false,
			owner: dialRef});
	},
	drawIndicator: function(centerX, centerY, outerRadius, dialWidth, color, ticks, lineWidth, circleWidth) {
		dialRef.$.watchFace.createComponent({
			kind: "tld.Shape2D.Arc",
			lineWidth: circleWidth,
			outlineColor: color,
			color: "white",
			x: centerX, 
			y: centerY, 
			radius: outerRadius, 
			startAngle: -90, 
			endAngle: 270,
			antiClockwise:false,
			owner: dialRef});
			
		dialRef.$.watchFace.createComponent({
			kind: "tld.Shape2D.Arc",
			lineWidth: 4,
			outlineColor: color,
			color: "white",
			x: centerX, 
			y: centerY, 
			radius: outerRadius - dialWidth, 
			startAngle: -90, 
			endAngle: 270,
			antiClockwise:false,
			owner: dialRef});
		var degreeMovement = 360/ticks;
		for (var tickDegree = 0; tickDegree <= 360; tickDegree += degreeMovement) {
			dialRef.$.watchFace.createComponent({
				kind: "tld.Shape2D.Vector",
				lineWidth: lineWidth,
				lineCap :"round",
				outlineColor: color,
				color: "",
				startPoint:{x: centerX, y: centerY},
				startDistance: outerRadius - dialWidth + (dialWidth/4), 
				endDistance: outerRadius - (dialWidth/4), 
				angle: tickDegree - 90, 
				owner: dialRef});
		}
	},
	loop: function() {
		if (dialRef.g_change < 6 && true == dialRef.timerRunning) {
			dialRef.setupCanvasSize();
			dialRef.g_change++; // all this kludginess is because the rotate event happens before the new widht and height are available
			// tried using setTimeout to delay redraw, doesn't seem to work, so count attempts
		}
		if (!dialRef.firstTime && false == dialRef.timerRunning) {
			this.start = Date.now();
			this.cancel = enyo.requestAnimationFrame(enyo.bind(this,"loop"));
			return;
		}
		dialRef.g_timeStr = dialRef.timeString();
		dialRef.displayTime();

		
		dialRef.firstTime = false;
		this.frame++;
		// update ball positions
		
		// If firstTime, render, otherwise need to evalualte if each component gets destroyed or not
		
		// Need to figure out when to destroy each component
		
		var canvasCenterX = dialRef.g_width/2;
		var canvasCenterY = -20 + (dialRef.g_height - heightMargin)/2;
		
		var outerRadius = dialRef.g_width;
		if (dialRef.g_height < outerRadius) outerRadius = dialRef.g_height - heightMargin;
		outerRadius = .4 * outerRadius;
		var dialWidth = outerRadius/5;
		var angle = 0;
		
		var found = false;
		
		/* More elegant, but doesn't seem to really make a difference, ends up needing suplicate code for first time through
		for (var i = 0, b; (b = dialRef.$.timerLayer.children[i]); i++) {
			if (b.name == "milli") {
				// Milli seconds
				b.destroy();
				angle = (360 * dialRef.milliSec / 1000) - 90;
				// Seconds
				dialRef.drawTimerHand(canvasCenterX, canvasCenterY, outerRadius, dialWidth, dialRef.milliColor, angle, "milli");
				found = true;
			} else if (b.name == "second") {
				// Seconds
				angle = (360 * dialRef.second / 60) - 90;
				if (angle != b.endAngle) {
					b.destroy();
					dialRef.drawTimerHand(canvasCenterX, canvasCenterY, outerRadius - (dialWidth + 5), dialWidth, dialRef.secColor, angle, "second");
				}
			} else if (b.name == "minute") {
				// Minutes
				angle = (360 * dialRef.minute / 60) - 90;
				if (angle != b.endAngle) {
					b.destroy();
					dialRef.drawTimerHand(canvasCenterX, canvasCenterY, outerRadius - (2 * (dialWidth + 5)), dialWidth, dialRef.minColor, angle, "minute");
				}
			} else if (b.name == "hour") {
				// Hours
				angle = (360 * dialRef.hour / 12) - 90;
				alert("Hour Angle " + angle + ", old angle "  + b.endAngle)
				if (angle != b.endAngle) {
					b.destroy();
					dialRef.drawTimerHand(canvasCenterX, canvasCenterY, outerRadius - (3 * (dialWidth + 5)), dialWidth, dialRef.minColor, angle, "hour");
				}
			}
		}
		*/

		if (!found) {
			this.$.timerLayer.destroyClientControls();
			// Milli seconds
			angle = (360 * dialRef.milliSec / 1000) - 90;
			dialRef.drawTimerHand(canvasCenterX, canvasCenterY, outerRadius, dialWidth, dialRef.milliColor, angle, "milli");
			outerRadius -= dialWidth + 5;

			angle = (360 * dialRef.second / 60) - 90;
			// Seconds
			dialRef.drawTimerHand(canvasCenterX, canvasCenterY, outerRadius, dialWidth, dialRef.secColor, angle, "second");
			outerRadius -= dialWidth + 5;
			
			angle = (360 * dialRef.minute / 60) - 90;
			// Minutes 
			dialRef.drawTimerHand(canvasCenterX, canvasCenterY, outerRadius, dialWidth, dialRef.minColor, angle, "minute");
			outerRadius -= dialWidth + 5;
			
			angle = (360 * dialRef.hour / 12) - 90;
			// Hours
			dialRef.drawTimerHand(canvasCenterX, canvasCenterY, outerRadius, dialWidth, dialRef.hourColor, angle, "hour");
			outerRadius -= dialWidth + 5;
		}
		
		dialRef.$.canvas.update();
		this.start = Date.now();
		
		this.cancel = enyo.requestAnimationFrame(enyo.bind(this,"loop"));
	},
	drawTimerHand: function(centerX, centerY, outerRadius, dialWidth, color, angle, name) {
		dialRef.$.timerLayer.createComponent({
			kind: "tld.Shape2D.Arc",
			name: name,
			lineWidth: dialWidth,
			outlineColor: color,
			color: '',
			x: centerX, 
			y: centerY, 
			radius: outerRadius - (dialWidth/2), 
			startAngle: -90, 
			endAngle: angle,
			antiClockwise:false,
			lineCap :"butt",
			owner: dialRef});
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
		dialRef.$.timerText.setText("Elapsed: " + '00:00:00.000');
		dialRef.$.splitText.setText("Split: " + '00:00:00.000');
		dialRef.cleanup();
	},
	cleanup: function() {
		dialRef.g_timeStr = '00:00:00.000';
		dialRef.$.timerLayer.destroyClientControls();
		dialRef.$.timerLayer.destroyClientControls();
	},
	displayTime: function() {
		dialRef.$.timerText.setText("Elapsed: " + dialRef.g_timeStr);
		topWatchRef.displayTime(dialRef.g_timeStr);
	},
	displaySplitTime: function() {
		dialRef.$.splitText.setText("Split: " + dialRef.g_timeStr);
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