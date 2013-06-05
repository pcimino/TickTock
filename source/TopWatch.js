/* Copyright 2012-2013 Trans Lunar Designs, Inc. */
// Globals are a cheat plain and simple. I get confused with the different namespaces and calling back and forth between classes
// there's a way to do it with parent or window.TopWatch, but this is a little easier
var dialRef = {};
var topWatchRef = {};
var dialLabel = "";
var watchLabel = "";

// var mailto_link = 'mailto:'+email+'?subject='+subject+'&body='+body_message;

enyo.kind({
	name: "TopWatch",
	kind: "FittableRows",
	classes: "app enyo-fit",
	components: [
		{name: "slidingPane", kind: "Panels", fit: true, arrangerKind: "CollapsingArranger", animate: true, components: [
			{name: "leftPanel", style: "width: 100%;", fixedWidth: true, draggable: true, animate: true, components: [
				{kind:"onyx.MoreToolbar", ontap: "closePanel", components: [
					{kind: "onyx.Grabber", noStretch: 'true', ontap: "closePanel"}, {content: "Splits"},
					{kind: "onyx.IconButton", src: "img/QuestionMark.png", ontap: "openPopup", popup: "popupHelp", style: "margin-left: 90%;"}
				]},
				{kind: "TopWatchDial"}
			]},
			{name: "rightPanel", style: "width: 30%;", fixedWidth: false, draggable: true, animate: true, components: [
				{kind:"onyx.MoreToolbar", name:"rightToolbar", ontap: "openPanel", components: [
					{kind: "onyx.Grabber", noStretch: 'true', ontap: "openPanel"},
					{content: "Timer"},
					{kind: "onyx.IconButton", src: "img/QuestionMark.png", ontap: "openPopup", popup: "popupHelp", style: "margin-left: 90%;"}
				]},
				{kind: "List", name: "splitList", layoutKind: "FittableRowsLayout", style: "margin-top:55px;", classes: "onyx enyo-fit", touch: true, count: 1, onSetupItem: "setupItem", item: "item1", components: [
					{name: "item1", classes: "panels-sample-sliding-item", style: "margin-left:20px;font-size:26px;"}
				]}
			]}
		]},
		{kind: onyx.MoreToolbar,
			name: "ButtonToolbar",
			layoutKind: "FittableRowsLayout",
			classes: "onyx",
			style: "height: 50px;",
			components: [
				{kind: "onyx.Button", name: "startSplitButton", content: "Start", ontap: "startSplitTimer"},
				// Not happy with button choices, needed to combine button functions to save on handset realestate
				// Not working properly{kind: "onyx.Button", content: "Reset", ontap: "resetTimer"},
				{kind: "onyx.Button", name: "stopResetButton", content: "Reset", ontap: "stopReset", style: "margin-left: 145px;"}
			]
		},
		{kind: "PopupDialog", name: "HelpPopup"},
		{kind: onyx.Popup,
			name: "popupHelp",
			centered: true,
			style: "text-align: center; padding: 10px; background: #C9C9C9;",
			components: [
				{
					kind: "Image",
					src: "img/LogoColor_162.png",
				},
				{kind: "Button",
					content: "Email Support@TransLunarDesigns.com",
					ontap: "buttonEmailTap",
				},
				{name: "message", style: "font-size: 26px; padding: 6px; text-align: center;color:black;", content:"Enyo 2 Demonstration App"},
				{kind: "onyx.Button",
						content: "Project Blog & Code",
						ontap: "openBlog",
				},
				{kind: "onyx.Button",
					style: "margin-left: 20px;",
					content: "Cancel",
					ontap: "buttontapCancelHelp",
				}
			]
		}
	],
	published: {
		// Data list
		splitTimeData: [{id:"", value:"Splits"}]
	},
	rendered: function() {
		this.inherited(arguments);
		topWatchRef = this;
	},
	startSplitTimer: function() {
		if (dialRef.timerRunning === false) {
			//dialRef.startTimer();
      enyo.asyncMethod(dialRef,"startTimer");
			this.$.startSplitButton.setContent("Split");
			this.$.stopResetButton.setContent("Stop");
		} else {
			dialRef.splitTimer();
		}
	},
	addSplit: function(record) {
		topWatchRef.splitTimeData.push(record);
		//topWatchRef.$.splitList.renderRow(topWatchRef.splitTimeData.length-1);
		topWatchRef.$.splitList.reset();
	},
	getNextId: function() {
		return topWatchRef.padStr(topWatchRef.splitTimeData.length, " ", 4);
	},
	stopReset: function() {
		if (dialRef.timerRunning === false) {
			dialRef.$.timerLayer.destroyClientControls();
			dialRef.resetTimer();
			topWatchRef.splitTimeData = [{id:"", value:"Splits"}];
			// refresh list row
			topWatchRef.$.splitList.reset();
			// Why twice?
			topWatchRef.$.splitList.reset();
			// Commenting out the RESET for now, funky behavior: If running, need to press reset twice, once to stop the timer and once to clear the dial, if stopped, reset won't clear the dial
			dialRef.$.canvas.update();
		} else {
			dialRef.stopTimer();
			this.$.startSplitButton.setContent("Start");
			this.$.stopResetButton.setContent("Reset");
		}
	},
	closePanel: function() {
		var index = this.$.slidingPane.setIndex(1);
	},
	openPanel: function() {
		var index = this.$.slidingPane.setIndex(0);
	},
	displayTime: function(timeStr) {
		topWatchRef.splitTimeData[0].value = "Time: " + timeStr;
		topWatchRef.$.splitList.reset();
	},
	setupItem: function(inSender, inEvent) {
		inSender.count = this.splitTimeData.length;
		var inIndex = inEvent.index;
		if (inIndex < this.splitTimeData.length) {
			if (inIndex < 0) return false;
			var record = this.splitTimeData[inIndex];
			if (record.id.length > 0) {
				this.$[inSender.item].setContent(record.id + ": " + record.value);
			} else {
				this.$[inSender.item].setContent(record.value);
			}
			return true;
		}
	},
	openPopup: function(inSender) {
		var p = this.$[inSender.popup];
		if (p) {
			p.show();
		}
	},
	buttonEmailTap: function() {
		window.open("mailto:Support@TransLunarDesigns.com?subject=Question/Suggestion");
		this.$.popupHelp.hide();
	},
	buttontapCancelHelp: function() {
		this.$.popupHelp.hide();
	},
	buttonClick: function() {
		this.$.openAppService.call({
			id: 'com.palm.app.email',
			params: {
				summary: "Top Watch question/comment",
				text: "",
				recipients: [{
					type: "email",
					role: 1,
					value: "support@translunardesigns.com",
					contactDisplay: "Trans Lunar Designs"
				}]
			}
		});
	},
	// popup helper
	pop: function(inSender) {
		this.popMessage(inSender.message);
	},
    popMessage: function(message) {
        this.$.HelpPopup.show();
		this.$.HelpPopup.setMessage(message);
    },
	padStr: function(stringVal, padChar, length) {
		var retStr = padChar + stringVal;
		return retStr.substring(stringVal.length - length);
	},
	openBlog: function() {
		window.open("http://pcimino.blog.com/enyo/")
	}
});